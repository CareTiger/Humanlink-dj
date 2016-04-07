from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

from account.models import Account
from account.views import logout, verify, invite_accept_redirect
from api_helpers import composeJsonResponse
from pusher import pusher


def index(request):
	return render("home/landing.html")


def caregivers(request):
	return render("home/caregivers.html")


def home(request):
	return render("home/index.html")


@login_required
def app(request):
	return render("dashboard/index.html")


@login_required
def settings(request):
	return render('settings/index.html')


def logout(request):
	""" -Logs out user, and redirects to home page """

	logout()
	return redirect('home/index.html')


def r(request):
	""" -Redirects the request to the given URL. """
	url = request.args.get('url', 'home/index.html')

	return redirect(url, code=302)


def verify_email(request, token):
	""" -Verifies Email """

	return verify(token)


def invite_accept(request, token):
	""" -Redirects user after successful invite """

	return invite_accept_redirect(token)


def pusher_auth(request):
	""" -Pusher private channel authentication

	Docs: https//pusher.com/docs/authenticating_users
	"""
	user = request.user

	socket_id = request.form.get('socket_id', '')
	channel = request.form.get('channel_name', '')

	if not (socket_id or channel or user):
		raise Exception("Permission denied.")

	fragments = channel.split('-')
	resource = fragments[1]
	auth = pusher.authenticate(channel, socket_id)
	try:
		if resource == 'account' and account_subscribe(int(fragments[2])):
			context = {
				'auth': auth
			}
			return composeJsonResponse(200, "", context)
	except:
		pass
	raise Exception("Permission denied.")


def account_subscribe(request, account_id):
	""" -Checks whether the account_id is the logged in account"""

	user = request.user
	account = Account.objects.get(email=user.email, password=user.password)

	return account and account.id == account_id


def terms(request):
	return render("pages/terms.html")
