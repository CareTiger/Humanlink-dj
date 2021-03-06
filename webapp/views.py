import json
import logging

from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render, redirect

from account.models import Account, CareGiver, CareSeeker
from account.views import logout, verify, invite_accept_redirect, requestPost, \
    check_account_availability
from api_helpers import composeJsonResponse
from django.template import RequestContext
import settings
from message.views import accept_thread_invite
from org.models import Org
from pusher.pusher import Pusher
from django.views.decorators.csrf import csrf_exempt


def index(request):
    return render(request, "home/landing.html")


def caregivers(request):
    return render(request, "home/caregivers.html")


def check_availability(request, email):
    data = check_account_availability(email)
    return data

def home(request):
    if request.user.is_active:

        x = type(request.user)

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
        return render(request, "home/index.html", context)
    else:
        return render(request, "home/index.html",
                      context_instance=RequestContext(request))


@login_required(login_url='/home/login/')
def app(request):
    account = Account.objects.get(email=request.user.email)
    try:
        accountId = account.id
        org = Org.objects.filter(actor=account.id)
        org = org[0].name.lower()
    except Exception, e:
        logging.error(e)
        org = []

    context = {
        'userdata': {
            'id': account.id
        },
        'user_data': {
            'gravatar_url': account.gravatar_url(),
            'name': account.username,
            'email': account.email,
            'org': org
        }
    }
    return render(request, "dashboard/index.html", context)


@login_required(login_url='/home/login/')
def settings(request):
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
    return render(request, 'settings/index.html', context)


def logout_user(request):
    """ -Logs out user, and redirects to home page """

    logout(request)
    return redirect('/home/index.html')


def r(request):
    """ -Redirects the request to the given URL. """
    url = request.GET.get('url', 'home/index.html')

    return redirect(url, code=302)


def verify_email(request, token):
    """ -Verifies Email """

    return verify(request, token)


def invite_accept(request, token):
    """ -Redirects user after successful invite """

    return invite_accept_redirect(token)


def thread_invite_accept_redirect(request, token):
    """ -Redirects user after successful thread invite"""

    return accept_thread_invite(token)


@csrf_exempt
def pusher_auth(request):
    # """ -Pusher private channel authentication
    # Docs: https//pusher.com/docs/authenticating_users
    # """

    if request.method == 'POST':
        user = request.user

        socket_id = request.POST['socket_id']
        channel = request.POST['channel_name']

        if not (socket_id or channel or user):
            raise Exception("Permission denied.")

        fragments = channel.split('-')
        resource = fragments[1]
        resource_id = int(fragments[2])

        account = Account.objects.get(email=user.email)

        pusher_client = Pusher(app_id=199731, key='feea095554f736862bf4',
                               secret="9550fb09aacce399eeb6",
                               cluster='mt1', ssl=True)

        auth = pusher_client.authenticate(channel=channel, socket_id=socket_id)

        try:
            if resource == 'account' and (account.id == resource_id):
                print(auth)
                context = {
                    'channel': channel,
                    'auth': auth
                }
                return composeJsonResponse(200, "", context)
            else:
                return {'nope'}
        except:
            raise Exception("Permission denied.")


def terms(request):
    return render(request, "pages/terms.html")
