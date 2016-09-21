import pickle
import urllib

import codecs
import os
import logging

import datetime
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.forms.models import model_to_dict
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from itsdangerous import URLSafeTimedSerializer
from django.conf import settings
import json
from django.shortcuts import render, redirect
from api_helpers import composeJsonResponse
from account.models import Account, CareGiver, CareSeeker
from message.models import Thread, ThreadChat, CHAT_CHOICES, ThreadMember, ThreadInvite
from org.models import Org, OrgInvite, OrgMember
from pusher.pusher import Pusher
from .forms import BasicInfo, CareGiverInfo, LoginForm, AcceptInvite, SignUp, \
    CareSeekerInfo, Nearme, ResetPassword
from django.contrib.auth import logout
from django.http import QueryDict
import ast
from django.contrib.auth import authenticate, login as auth_login
from django.contrib import messages
import mandrill


@login_required(login_url='/home/login/')
def index(request):
    # """ -Return Account Template """
    account = Account.objects.get(email=request.user.email)
    context = {
        'userdata': {
            'id': account.id
        },
        'user_data': {
            'gravatar_url': account.gravatar_url(),
            'name': account.username,
            'email': account.email
        }
    }
    return render(request, 'accounts/index.html', context)


def broadcast(request, chat_id=None):
    # """Sends out push notifications to thread members about chat message. """

    user = Account.objects.filter(email=request.user.username[:30])
    if user:
        user = user[0]

    now = str(datetime.datetime.now().strftime('%I:%M %p'))

    print '###########'
    print 'account.views.broadcast'

    chat = ThreadChat.objects.get(id=chat_id)
    thread = Thread.objects.get(id=chat.thread.id)
    chat = model_to_dict(chat)
    chat['gravatar_url'] = user.gravatar_url()
    chat['name'] = user.email
    chat['created'] = now
    chat = json.dumps(chat)

    if not chat or not thread:
        raise Exception("thread or chat not found")

    all_members = ThreadMember.objects.filter(thread=thread).exclude(account=user.id)

    pusher = Pusher(app_id='197533', key='2676265f725e22f7e5d0',
                    secret="bcfc287023b0df0c7d2f", cluster='mt1')

    for member in all_members:
        channels = ['public-account-{}'.format(member.account.id)]
        pusher.trigger(channels, 'message.new', {'thread_id': thread.id, 'chat': chat})


def add_to_welcome(request, org_id, account_id):
    account = Account.objects.get(id=account_id)
    org = Org.objects.get(id=org_id)
    thread = Thread.objects.get(org=org, name="welcome")
    if thread:
        ThreadMember.objects.create(account=account, thread=thread)

        chat = ThreadChat.objects.create(thread=thread, account=account,
                                         text=account.email + ' has joined ',
                                         kind=0, inviter=2, remover=3)

        broadcast(request, chat_id=chat.id)


# Converts AJAX JSON into query dictionary for the view to process.
def requestPost(request):
    querystring = urllib.urlencode(ast.literal_eval(request.body))
    postdata = QueryDict(query_string=querystring)

    return postdata


@csrf_exempt
def login(request):
    if request.is_ajax():
        if request.method == "POST":
            form = LoginForm(requestPost(request))

            if form.is_valid():
                cleaned_data = form.cleaned_data

                if len(form.errors) > 0:
                    return cleaned_data
                else:
                    email = cleaned_data['email']
                    password = cleaned_data['password']

                    if email is None or password is None:
                        messages.error(form.request,
                                       'Please enter an email and password.')
                        return form.ValidationError("Error")
                    else:
                        account = Account.objects.get(email=email)
                        passwords_match = account.check_password(password)

                        if passwords_match:
                            form.cached_user = authenticate(username=email[:30],
                                                            password=password)

                            auth_login(request, form.cached_user)
                        else:
                            messages.error(form.request, 'Password is incorrect')

                        if form.cached_user is None:
                            form.errors["password"] = form.error_class(
                                ["Password incorrect. Passwords are case sensitive."])
                        elif not form.cached_user.is_active:
                            messages.error(form.request,
                                           'This account is inactive. Please check your inbox for our confirmation email, and '
                                           'click the link within to activate your account.')
                            raise form.ValidationError("Error")

                        if cleaned_data['invite']:
                            token = cleaned_data['invite']
                        elif cleaned_data['token']:
                            token = cleaned_data['token']
                        else:
                            token = False

                        if token:
                            if ThreadInvite.objects.filter(token=token):
                                threadInvite = ThreadInvite.objects.get(token=token)
                                thread = Thread.objects.get(id=threadInvite.thread.id)
                                threadmember = ThreadMember.objects.filter(
                                    account=account, thread=thread)
                                if not threadmember:
                                    ThreadMember.objects.create(account=account,
                                                                thread=thread)
                            elif OrgInvite.objects.filter(token=token):
                                orgInvite = OrgInvite.objects.get(token=token)
                                if orgInvite.used:
                                    raise Exception(
                                        "Invitation token has already been used.")

                                org = Org.objects.get(id=orgInvite.org.id)
                                org_member = OrgMember.objects.filter(account=account,
                                                                      org=org)
                                thread = Thread.objects.get(name='welcome', org=org)
                                welcomeChat = ThreadChat.objects.filter(thread=thread,
                                                                        account=account,
                                                                        text=account.email + ' has joined ')
                                if not welcomeChat:
                                    add_to_welcome(org_id=org.id, account_id=account.id)

                                if not org_member:
                                    OrgMember.objects.create(account=account, org=org)
                                    invite.used = False
                            else:
                                raise Exception("Invitation token is invalid.")

                        context = {
                            'message': form.errors,
                            'next': '/app/',
                        }

                        return composeJsonResponse(200, "", context)


def logout_user(request):
    logout(request)


@csrf_exempt
def signup(request):
    # """Register a new account with a new org."""
    if request.is_ajax():
        if request.method == "POST":
            form = SignUp(requestPost(request))

            if form.is_valid():
                cleaned_data = form.cleaned_data

                email = cleaned_data['email']
                password = cleaned_data['password']
                org_name = cleaned_data['org_name']
                org_username = cleaned_data['org_username']

                if cleaned_data['token']:
                    invite_token = cleaned_data['token']
                else:
                    invite_token = cleaned_data['invite']

                try:
                    account = Account.objects.create(email=email)
                    # Encrypt password and save in database
                    account.password = account._set_password(password)
                    account.save()

                    userExists = User.objects.filter(username=email[:30])
                    if not userExists:
                        if len(email) < 30:
                            user = User.objects.create_user(email, email, password)
                        else:
                            email = email[:30]
                            user = User.objects.create_user(email, email, password)

                    login(request)

                    # Only hits this block of code if they are signing up after being invited to a thread or org, and do
                    # not have a profile yet.
                    if invite_token:
                        # If there is not thread invitation for that token code, it must be an org invitation
                        if ThreadInvite.objects.filter(token=invite_token):
                            invitation = ThreadInvite.objects.get(token=invite_token)
                            thread = Thread.objects.get(id=invitation.thread.id)
                            threadmember = ThreadMember.objects.filter(thread=thread,
                                                                       account=account)
                            if not threadmember:
                                ThreadMember.objects.create(thread=thread,
                                                            account=account)
                        else:
                            invitation = OrgInvite.objects.get(token=invite_token)
                            if invitation.used:
                                raise Exception("invitation code is invalid")
                            org = Org.objects.get(id=invitation.org.id)
                            OrgMember.objects.create(org=org, account=account)
                            invitation.used = False
                            invitation.save()
                            add_to_welcome(org_id=org.id, account_id=account.id)

                    if org_username and org_name:
                        org = Org.objects.create(name=org_name, username=org_username,
                                                 actor=account)
                        OrgMember.objects.create(account=account, org=org)
                        Thread.objects.create(name='welcome', account=account,
                                              owner=account, org=org,
                                              purpose='To welcome new members to the team.')
                        add_to_welcome(request, org_id=org.id, account_id=account.id)

                    md = mandrill.Mandrill(settings.MANDRILL_API_KEY)
                    t = invite_token.replace(' ', '+')
                    url = "https://localhost:8000/verify/{}".format(t)
                    message = {
                        'global_merge_vars': [
                            {
                                'name': 'VERIFICATION_URL',
                                'content': url
                            },
                        ],
                        'to': [
                            {
                                'email': cleaned_data['email'],
                            },
                        ],
                        'subject': 'Welcome to Human Link',
                    }
                    message['from_name'] = message.get('from_name', 'Humanlink')
                    message['from_email'] = message.get('from_email',
                                                        'support@humanlink.co')
                    try:
                        md.messages.send_template(
                            template_name='humanlink-welcome', message=message,
                            template_content=[], async=True)
                    except mandrill.Error as e:
                        logging.exception(e)
                        raise Exception(e)

                    context = {
                        'message': 'ok'
                    }

                    return composeJsonResponse(200, "", context)

                except Exception, e:
                    logging.error(e)
                    Account.objects.filter(email=email).delete()
                    User.objects.filter(username=email[:30]).delete()
                    Org.objects.filter(name=org_name, username=org_username).delete()


def check_account_availability(email):
    account = Account.objects.filter(email=email)
    if account:
        context = {
            'account': True
        }
    else:
        context = {
            'account': False
        }

    return composeJsonResponse(200, '', context)


@csrf_exempt
def accept_invite(request):
    # """ -Create a new account and accept an org member invitation."""

    if request.method == "POST":
        form = AcceptInvite(request.POST)

        if form.is_valid():
            cleaned_data = form.cleaned_data
            token = cleaned_data['token']
            email = cleaned_data['email']
            password = cleaned_data['password']
            password_conf = cleaned_data['password_conf']

            if password != password_conf:
                raise Exception('Password does not match confirmation.')

            invite = OrgInvite.objects.get(token=token)

            if not invite:
                raise Exception('Invitation token is invalid.')
            if invite.used:
                raise Exception('Invitation token has already been used.')

            Account.objects.create(email=email)
            org = invite.org

            new_account = Account.objects.get(email=email)
            OrgMember.objects.create(account=new_account, org=org)
            org.add_members(new_account)

            add_to_welcome(org=org, account=new_account, inviter_id=invite.token)

            context = {
                'message': 'ok'
            }

            return composeJsonResponse(200, "", context)


def invite(request, token):
    # """ -Retrieve an org member invitation information """
    invite = get_invite(token)
    if invite.used:
        raise Exception("Invitation token has already been used")

    context = {
        "invite": invite
    }

    return composeJsonResponse(200, "", context)


@login_required(login_url='/home/login/')
def me(request):
    # """ - Retrieve Current Account Information in JSON Format """
    account = Account.objects.get(email=request.user.email)

    context = {
        'first': account.first,
        'last': account.last,
        'phone_number': account.phone_number,
        'username': account.username,
        'email': account.email,
    }

    return composeJsonResponse(200, "", context)


@login_required(login_url='/home/login/')
@csrf_exempt
def update(request):
    # """ - Update Account Information """
    account = Account.objects.get(email=request.user.email)

    if request.method == "POST":
        form = BasicInfo(requestPost(request))

        if form.is_valid():
            cleaned_data = form.cleaned_data
            account.username = cleaned_data['username']
            account.first = cleaned_data['first']
            account.last = cleaned_data['last']
            account.phone_number = cleaned_data['phone_number']
            account.save()

            context = {
                'account': 'test'
            }

            return composeJsonResponse(200, "", context)


@login_required(login_url='/home/login/')
@csrf_exempt
def getTeam(request):
    # """ - Get Team Information """
    thrd_array = []
    thrdmbr_array = []

    account = Account.objects.get(email=request.user.email)
    threads = Thread.objects.all().filter(account=account)

    for thrd in threads:
        threadmembers = ThreadMember.objects.all().filter(thread=thrd)

        for thrdmbr in threadmembers:
            threadmember_map = {
                'email': thrdmbr.account.email,
                'name': thrd.name,
            }
            thrdmbr_array.append(threadmember_map)

    try:
        team = CareSeeker.objects.get(account=account)
        context = {
            'team_name': team.team_name,
            'mission': team.mission,
            'website': team.website,
            'threadmembers': thrdmbr_array,
            'public': team.public,
            'cough_assist': team.cough_assist,
            'hoyer_lift': team.hoyer_lift,
            'adaptive_utensil': team.adaptive_utensil,
            'meal_prep': team.meal_prep,
            'housekeeping': team.housekeeping,
        }
        return composeJsonResponse(200, "", context)
    except:
        context = {
        }
        return composeJsonResponse(200, "", context)


@login_required(login_url='/home/login/')
@csrf_exempt
def update_team(request):
    # """ - Update Team Information """
    account = Account.objects.get(email=request.user.email)

    try:
        team = CareSeeker.objects.get(account=account)
    except:
        team = CareSeeker(account=account)

    if request.method == "POST":
        form = CareSeekerInfo(requestPost(request))

        if form.is_valid():
            cleaned_data = form.cleaned_data
            team.team_name = cleaned_data['team_name']
            team.mission = cleaned_data['mission']
            team.website = cleaned_data['website']
            team.public = cleaned_data['public']
            team.hoyer_lift = cleaned_data['hoyer_lift']
            team.cough_assist = cleaned_data['cough_assist']
            team.adaptive_utensil = cleaned_data['adaptive_utensil']
            team.meal_prep = cleaned_data['meal_prep']
            team.housekeeping = cleaned_data['housekeeping']
            team.save()

            context = {
                'team_name': team.team_name,
                'mission': team.mission,
                'website': team.website,
            }
            return composeJsonResponse(200, "", context)


@login_required(login_url='/home/login/')
@csrf_exempt
def get_caregiver(request):
    # """ -Retrieve Caregiver Details for an Account """
    account = Account.objects.get(email=request.user.email)

    try:
        caregiver = CareGiver.objects.get(account=account)
        context = {
            'headline': caregiver.headline,
            'bio': caregiver.bio,
            'arrangements': caregiver.arrangements,
            'allergies': caregiver.allergies,
            'certificates': caregiver.certificates,
            'public': caregiver.public,
        }
        return composeJsonResponse(200, "", context)
    except:
        context = {
        }
        return composeJsonResponse(200, "", context)


@login_required(login_url='/home/login/')
@csrf_exempt
def update_caregiver(request):
    # """ -Updates Account's Caregiver Information. """

    account = Account.objects.get(email=request.user.username)

    try:
        caregiver = CareGiver.objects.get(account=account)
    except:
        caregiver = CareGiver(account=account)

    if request.method == "POST":
        form = CareGiverInfo(requestPost(request))

        if form.is_valid():
            cleaned_data = form.cleaned_data
            caregiver.headline = cleaned_data['headline']
            caregiver.bio = cleaned_data['bio']
            caregiver.certificates = cleaned_data['certificates']
            caregiver.arrangements = cleaned_data['arrangements']
            caregiver.allergies = cleaned_data['allergies']
            caregiver.public = cleaned_data['public']
            caregiver.save()

            context = {
                'headline': caregiver.headline,
                'bio': caregiver.bio,
            }

            return composeJsonResponse(200, "", context)


@login_required(login_url='/home/login/')
def profile(request, account_id):
    # """ -Retrieve Profile With Account ID """

    account = Account.objects.get(id=account_id)
    context = {
        'account': account
    }

    return composeJsonResponse(200, "", context)


@login_required(login_url='/home/login/')
def nearme(request):
    caregivers = CareGiver.objects.all()
    careseekers = CareSeeker.objects.all()

    cgvr_array = []
    cskr_array = []

    if request.method == "GET":
        form = Nearme(request.GET)

        if form.is_valid():
            cleaned_data = form.cleaned_data

            # For Beta release we are not going to do a search string
            # print '***********'
            # print cleaned_data['search_string']
            # print '***********'

            for cgvr in caregivers:
                cgvr_map = {
                    'first': cgvr.account.first,
                    'last': cgvr.account.last,
                    'bio': cgvr.bio,
                    'headline': cgvr.headline,
                    'email': cgvr.account.email,
                    'public': cgvr.public
                }
                cgvr_array.append(cgvr_map)

            for cskr in careseekers:
                cskr_map = {
                    'email': cskr.account.email,
                    'mission': cskr.mission,
                    'team_name': cskr.team_name,
                    'public': cskr.public
                }
                cskr_array.append(cskr_map)

            context = {
                'caregivers': cgvr_array,
                'careseekers': cskr_array
            }

            return composeJsonResponse(200, "", context)


@login_required(login_url='/home/login/')
def caregiver_info(request, account_id):
    # """ -Retrieve Caregiver Details for an Account """

    caregiver = CareGiver.objects.get(account=account_id)
    context = {
        'caregiver': caregiver
    }
    return composeJsonResponse(200, "", context)


@login_required(login_url='/home/login/')
def caregiver_profile(request):
    email = request.GET.get('email')
    account = Account.objects.get(email=email)
    caregiver = CareGiver.objects.get(account=account)
    context = {
        'headline': caregiver.headline,
        'bio': caregiver.bio,
        'certificates': caregiver.certificates,
        'allergies': caregiver.allergies,
        'arrangements': caregiver.arrangements,
        'background_verified': caregiver.background_verified,
        'phone_verified': caregiver.phone_verified,
    }
    return composeJsonResponse(200, '', context)


@login_required(login_url='/home/login/')
def careseeker_profile(request):
    email = request.GET.get('email')
    account = Account.objects.get(email=email)
    careseeker = CareSeeker.objects.get(account=account)
    context = {
        'team_name': careseeker.team_name,
        'mission': careseeker.mission,
        'website': careseeker.website,
        'caregiver_needs': careseeker.caregiver_needs,
        'hoyer_lift': careseeker.hoyer_lift,
        'cough_assist': careseeker.cough_assist,
        'adaptive_utensil': careseeker.adaptive_utensil,
        'meal_prep': careseeker.meal_prep,
        'housekeeping': careseeker.housekeeping,
    }
    return composeJsonResponse(200, '', context)


@login_required(login_url='/home/login/')
@csrf_exempt
def connect(request):
    sender = request.user.email
    receiver = request.GET.get('email')

    account_sender = Account.objects.get(email=sender)
    account_receiver = Account.objects.get(email=receiver)

    thread = Thread.objects.get(name='welcome', owner=account_sender)
    threadmember = ThreadMember(thread=thread, account=account_receiver)
    threadmember.save()

    context = {

    }
    return composeJsonResponse(200, '', context)


@login_required(login_url='/home/login/')
@csrf_exempt
def reset_password(request):
    # Reset the password

    if request.method == 'POST':
        print '############'
        account = Account.objects.get(email=request.user.email)

        form = ResetPassword(requestPost(request))
        if form.is_valid():
            cleaned_data = form.cleaned_data
            passwords_match = account.check_password(cleaned_data['old_password'])
            if passwords_match:
                new_password = cleaned_data['new_password']
                account.password = account._set_password(new_password)
                account.save()

        context = {
            'message': 'ok'
        }
        return composeJsonResponse(200, '', context)


def get_invite(token):
    if not token:
        raise Exception("Invitation token is not specified")

    invitation = OrgInvite.objects.get(token=token)
    if not invitation:
        raise Exception("Invitation token is invalid.")

    return invitation


def invite_accept_redirect(token):
    # """ -Redirects to the accept invite frontend view with pre-fetched data. """

    key = token

    invitation = OrgInvite.objects.get(token=token)
    if not invitation:
        raise Exception("Invitation token is invalid")
    if invitation.used:
        raise Exception("Invitation token has already been used.")

    base = "home/accept"

    invite_dict = model_to_dict(invitation)

    url = '/{}/{}/?data={}'.format(base, token,
                                   urllib.quote_plus(json.dumps(invite_dict)))

    return redirect(url)


def generate_token(length):
    # """ -Returns randomly generate email token """

    return codecs.encode(os.urandom(length // 2), 'hex')


email_serializer = URLSafeTimedSerializer(settings.SECRET_KEY, salt='email-token')


def verification_token(account_id):
    """Get account's email verification token."""

    account = Account.objects.get(id=account_id)
    if not account.email:
        raise Exception("No email found for account {}".format(account.id))

    email_hash = account.email_hash()
    rand = generate_token(4)
    data = (account.id, email_hash, rand)
    return email_serializer.dumps(data)


def verify(request, token):
    # """ -If verification token is valid, Account.email_verified = True """

    try:
        account_id, email_hash, rand = email_serializer.loads(token)
        account = Account.objects.get(id=account_id)
        if account.email_hash() != email_hash:
            raise Exception("token invalid")
        if account.email_verified:
            raise Exception("Email address already verified.")
        account.email_verified = True
        account.save()
        logging.info('Email verified: {}'.format(account.email))
        login(request)
    except:
        logging.warning('Bad Signature.')
        raise Exception("Token invalid")


    # return redirect("/account s/")
    return HttpResponse('This Works')


def get_current_user(request):
    user = request.user
    account = Account.objects.get(username=user.username)

    return account


@csrf_exempt
def get_caregivers(request):
    # Returns all caregivers, based on search or no search
    caregiver_list = []
    if request.method == 'POST':
        context = {
            'message': 'post'
        }
        return composeJsonResponse(200, '', context)
    elif request.method == 'GET':
        caregivers = CareGiver.objects.all()
        if len(caregivers) > 0:
            for caregiver in caregivers:
                if caregiver.background_verified and caregiver.phone_verified:
                    account = Account.objects.get(id=caregiver.account.id)
                    caregiver_map = {
                        'first_name': account.first,
                        'last_name': account.last,
                        'phone_number': account.phone_number,
                        'account_id': account.id,
                        'headline': caregiver.headline,
                        'bio': caregiver.about,
                        'city': caregiver.city,
                        'phone_verified': account.phone_verified,
                        'background_verified': caregiver.background_verified
                    }
                    caregiver_list.append(caregiver_map)

            account = Account.objects.get(email=request.user.email)

            context = {
                'caregiver_list': caregiver_list,
                'userdata': {
                    'id': account.id
                },
                'user_data': {
                    'gravatar_url': account.gravatar_url(),
                    'name': account.username,
                    'email': account.email
                }
            }

            return composeJsonResponse(200, '', context)


def get_careseekers(request):
    # Return all careseekers who are 'public'
    if request.method == 'GET':
        careseekers_list = []
        careseekers = CareSeeker.objects.filter()
        for careseeker in careseekers:
            careseekers_list.append(careseeker)

        account = Account.objects.get(email=request.user.email)

        context = {
            'careseekers': careseekers,
            'userdata': {
                'id': account.id
            },
            'user_data': {
                'gravatar_url': account.gravatar_url(),
                'name': account.username,
                'email': account.email
            }
        }
        return composeJsonResponse(200, '', context)

    elif request.method == 'POST':
        context = {
            'message': 'post'
        }
        return composeJsonResponse(200, '', context)


def seeker_profile(request):
    if request.method == 'POST':
        context = {
            'message': 'ok'
        }
        return composeJsonResponse(200, '', context)
    if request.method == 'GET':
        context = {
            'message': 'ok'
        }
        return composeJsonResponse(200, '', context)
