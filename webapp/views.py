import json

from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render, redirect

from account.models import Account
from account.views import logout, verify, invite_accept_redirect, requestPost
from api_helpers import composeJsonResponse
from django.template import RequestContext
import settings
from pusher.pusher import Pusher
from django.views.decorators.csrf import csrf_exempt

def index(request):

	return render(request, "home/landing.html")

def caregivers(request):

	return render(request, "home/caregivers.html")

def home(request):

	return render(request, "home/index.html", context_instance=RequestContext(request))


# @login_required
def app(request):
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
	return render(request, "dashboard/index.html", context)


@login_required
def settings(request):
	return render(request, 'settings/index.html')


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

		pusher_client = Pusher(app_id='199731', key='1019dcd6d219db50d37e', secret='9550fb09aacce399eeb6',
							   cluster='ap1', ssl=True)
		auth = pusher_client.authenticate(channel, socket_id)

		try:
			if resource == 'account' and (account.id == resource_id):
				print(auth)
				context = auth
				return composeJsonResponse(200, "", context)
			else:
				return {'nope'}
		except:
			raise Exception("Permission denied.")


def terms(request):
	return render(request, "pages/terms.html")
