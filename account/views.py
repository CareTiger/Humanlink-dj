import urllib

from django.contrib.auth.decorators import login_required
from django.core.serializers import json
from django.shortcuts import render
from api_helpers import ComposeJsonResponse
from account.models import Account, CareGiver
from message.models import Thread
from org.models import Org, OrgInvite, OrgMember
from .forms import BasicInfo, CareGiverInfo, LoginForm, AcceptInvite, SignUp
from django.contrib.auth import logout

# Create your views here.

def index(request):
    """ -Return Account Template...?"""


def login(request):
    """ -Log in the user if credentials are valid """
    user = request.user
    account = Account.objects.get(email=user.email, password=user.password)

    if request.method == "POST":
        form = LoginForm(request.POST)

        if form.is_valid():
            cleaned_data = form.cleaned_data

            if cleaned_data['token']:
                token = cleaned_data['token']
                invite = OrgInvite.objects.get(token=token)
                org = Org.objects.get(id=invite.org_id)
                if not invite:
                    raise "Invitation token is invalid."
                if invite.used == True:
                    raise "Account is already in team."

                org_member = OrgMember.objects.get(account_id=account.id)
                if org_member:
                    raise "Account is already in team."
                else:
                    org.add_members(account.id, False, invite.is_admin)
                    invite.used = False
                    welcome_thread = Thread.objects.get(org_id=org.id, name='welcome')
                    if welcome_thread:
                        welcome_thread.add_members(account_id=account.id)

            else:
                pass

    #   TODO: send out notification to users that new thread member has been added to their thread.

    else:
        form = LoginForm()


def logout(request):
    logout(request)


def signup(request):
    """ -Register a new account with a new org."""
    if request.method == "POST":
        form = SignUp(request.POST)

        if form.is_valid():
            cleaned_data = form.cleaned_data

            email = cleaned_data['email']
            password = cleaned_data['password']
            org_name = cleaned_data['org_name']
            org_username = cleaned_data['org_username']
            invite = cleaned_data['invite']

            invitation = OrgInvite.objects.get(token=invite)

            if invitation.used == True and invite.reuse == False:
                raise "invite_invalid"

            account = Account(email=email, password=password)
            account.save()

            org = Org(org_name=org_name, org_username=org_username)
            org.save()

            invite.used = False
            invite.save()

            # Send Thank You Email

            #   TODO find out what table view from old website is pulling from:
            """
                try:
                    invites = Table('invites', connection=self.ddb)
                    item = invites.get_item(key=invite.lower())
                    if item.get('used', False) and item.get('reuse', False) is False:
                        raise invite_invalid
                except boto.dynamodb2.exceptions.ItemNotFound:
                    raise invite_invalid
            """

            login(request)

    else:
        form = SignUp()


def accept_invite(request):
    """ -Create a new account and accept an org member invitation."""

    if request.method == "POST":
        form = AcceptInvite(request.POST)

        if form.is_valid():
            cleaned_data = form.cleaned_data
            clean_token = cleaned_data['token']
            clean_email = cleaned_data['email']
            clean_password = cleaned_data['password']

            invite = OrgInvite.objects.get(token=clean_token)

            new_account = Account(email=clean_email, password=clean_password)
            new_account.save()

            org = Org.objects.get(id=invite.org_id)
            org.add_members(new_account.id, False, False)

    else:
        form = Payload()


def invite(request, token):
    """ -Retrieve an org member invitation information """
    invite = get_invite(token)
    if OrgInvite.used == True:
        raise "Invitation token has already been used"

    context = {
        "invite": invite
    }

    return ComposeJsonResponse(200, "", context)


@login_required
def me(request):
    """ - Retrieve Current Account Information in JSON Format """

    user = request.user
    account = Account.objects.get(email=user.email, password=user.password)

    context = {
        "account": account
    }

    return ComposeJsonResponse(200, "", context)


@login_required
def update(request):
    """ - Update Account Information """

    user = request.user
    account = Account.objects.get(email=user.email, password=user.password)

    if request.method == "POST":
        form = BasicInfo(request.POST)

        if form.is_valid:

            cleaned_data = form.cleaned_data
            account.first_name = cleaned_data['first_name']
            account.last_name = cleaned_data['last_name']
            account.phone = cleaned_data['phone']
            account.save()
    else:
        pass

        context = {
            'account': account
        }

    return ComposeJsonResponse(200, "", context)


@login_required
def update_caregiver(request):
    """ -Updates Account's Caregiver Information. """

    user = request.user
    account = Account.objects.get(email=user.email, password=user.password)
    caregiver = CareGiver.objects.get(account_id=account.id)

    if request.method == "POST":
        form = CareGiverInfo

        if form.is_valid:

            cleaned_data = form.cleaned_data
            caregiver.is_hireable = cleaned_data['is_hireable']
            caregiver.location = cleaned_data['location']
            caregiver.about = cleaned_data['about']
            caregiver.certs = cleaned_data['certs']
            caregiver.save()

            context = {
                'caregiver': caregiver
            }

    return ComposeJsonResponse(200, "", context)


@login_required
def profile(request, account_id):
    """ -Retrieve Profile With Account ID """

    account = Account.objects.get(id=account_id)
    context = {
        'account': account
    }

    return ComposeJsonResponse(200, "", context)


@login_required
def caregiver_info(request, account_id):
    """ -Retrieve Caregiver Details for an Account """

    caregiver = CareGiver.objects.get(account=account_id)
    context = {
        'caregiver': caregiver
    }

    return ComposeJsonResponse(200, "", context)

def invite_accept_redirect(token):
    """ -Redirects to the accept invite frontend view with pre-fetched data."""
    base = "Url for views.home + accept"
    invite = get_invite(token)
    url = '{}/{}?data={}'.format(base, token, urllib.quote_plus(json.dumps(invite)))

    # TODO - Redirect to specified url above. "localhost:8000/home/accept/14634456?data='invite-json-data'

def verify(token):
    if not token:
        raise "Invalid verification token"

def get_invite(token):
    if not token:
        raise "Invitation token is not specified"

    invitation = OrgInvite.objects.get(token=token)

    return invitation