import urllib

import codecs
import os
import logging

from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django_pusher.push import pusher
from itsdangerous import URLSafeTimedSerializer
from django.conf import settings
from django.core.serializers import json
from django.shortcuts import render, redirect
from api_helpers import composeJsonResponse
from account.models import Account, CareGiver
from message.models import Thread, ThreadChat, CHAT_CHOICES
from org.models import Org, OrgInvite, OrgMember
from .forms import BasicInfo, CareGiverInfo, LoginForm, AcceptInvite, SignUp
from django.contrib.auth import logout
import mandrill

@login_required
def index(request):
	# """ -Return Account Template """

	return render('accounts/index.html')


def broadcast(self, chat_id=None):
	# """Sends out push notifications to thread members about chat message. """

	def chunks(li, n):
		"""Yields n-sized chunks from the list."""
		for i in xrange(0, len(li), n):
			yield li[i:i + n]

	chat = ThreadChat.objects.get(id=chat_id)
	thread = Thread.objects.get(id=chat.thread_id)

	if not chat or thread:
		raise Exception("thread or chat not found")

	partition = chunks(thread.members, 10)
	for part in partition:
		channels = ['private-account-{}'.format(m.account_id) for m in part]
		pusher.trigger(channels, 'message.new', {'thread_id': thread.id, 'chat': chat})


def add_to_welcome(request, org_id, account_id, inviter_id):

	thread = Thread.objects.get(org_id=org_id, name="welcome")
	if thread:

		thread.add_members(account_id=account_id)
		chat = ThreadChat(thread_id=thread.id, account_id=account_id, text=account_id, kind=CHAT_CHOICES(2))
		chat.save()

		broadcast(chat.id)

def login(request):
	# """ -Log in the user if credentials are valid """
	account = get_current_user(request)

	if request.method == "POST":
		form = LoginForm(request.POST)

		if form.is_valid():
			cleaned_data = form.cleaned_data

			if not form.email or not form.password:
				raise Exception("Please enter your email address and password")

			if cleaned_data['token']:

				token = cleaned_data['token']
				invite = OrgInvite.objects.get(token=token)
				org = Org.objects.get(id=invite.org_id)
				if not invite:
					raise Exception("Invitation token is invalid.")
				if invite.used == True:
					raise Exception("Invitation token has already been used.")

				org_member = OrgMember.objects.get(account_id=account.id)
				if org_member:
					raise Exception("Account is already in team.")
				else:
					org.add_members(account.id, False, invite.is_admin)
					invite.used = False

					add_to_welcome(org_id=org.id, account_id=account.id, inviter_id=invite.token)

			else:
				pass

	else:
		form = LoginForm()


def logout_user(request):
	logout(request)


def signup(request):
	# """Register a new account with a new org."""

	if request.method == "POST":
		form = SignUp(request.POST)

		if not form.email or not form.password:
			raise Exception("Email and Password are required")
		if form.password != form.password_conf:
			raise  Exception("Password does not match confirmation")
		if not form.org_name or not form.org_username:
			raise Exception('Organization name and username are required')
		if not form.invite:
			raise Exception('Invitation code is required')

		if form.is_valid():
			cleaned_data = form.cleaned_data

			email = cleaned_data['email']
			password = cleaned_data['password']
			org_name = cleaned_data['org_name']
			org_username = cleaned_data['org_username']
			invite_token = cleaned_data['invite']

			invitation = OrgInvite.objects.get(token=invite_token)

			if invitation.used:
				raise Exception("invitation code is invalid")

			account = Account(email=email, password=password)
			account.save()

			org = Org(org_name=org_name, org_username=org_username)
			org.save()

			invitation.used = False
			invitation.save()

			login(request)

			# Send Email

			md = mandrill.Mandrill(settings.MANDRILL_API_KEY)
			t = invite_token.replace(' ', '+')
			url = "https://www.humanlink.co/verify/{}".format(t)
			message = {
				'global_merge_vars': [
					{'name': 'VERIFICATION_URL', 'content': url},
				],
				'to': [
					{'email': account.email},
				],
			}
			message['from_name'] = message.get('from_name', 'Humanlink')
			message['from_email'] = message.get('from_email', 'support@humanlink.co')
			try:
				md.messages.send_template(
					template_name='humanlink-welcome', message=message,
					template_content=[], async=True)
			except mandrill.Error as e:
				logging.exception(e)
				raise Exception('Unknown service exception')

	else:
		form = SignUp()


def accept_invite(request):
	# """ -Create a new account and accept an org member invitation."""

	if request.method == "POST":
		form = AcceptInvite(request.POST)

		if not form.email or not form.password:
			raise Exception('Email and password are required.')
		if form.password != form.password_conf:
			raise Exception('Password does not match confirmation.')
		if not form.token:
			raise Exception('Invitation code is required.')

		if form.is_valid():
			cleaned_data = form.cleaned_data
			clean_token = cleaned_data['token']
			clean_email = cleaned_data['email']
			clean_password = cleaned_data['password']

			invite = OrgInvite.objects.get(token=clean_token)

			if not invite:
				raise Exception('Invitation token is invalid.')
			if invite.used:
				raise Exception('Invitation token has already been used.')

			new_account = Account(email=clean_email, password=clean_password)
			new_account.save()

			org = Org.objects.get(id=invite.org_id)
			org.add_members(new_account.id, False, False)

			add_to_welcome(org_id=org.id, account_id=new_account.id, inviter_id=invite.token)

	else:
		form = AcceptInvite()


def invite(request, token):
	# """ -Retrieve an org member invitation information """
	invite = get_invite(token)
	if OrgInvite.used:
		raise Exception("Invitation token has already been used")

	context = {
		"invite": invite
	}

	return composeJsonResponse(200, "", context)

@login_required
def me(request):
	# """ - Retrieve Current Account Information in JSON Format """

	account = get_current_user(request)

	context = {
		"account": account
	}

	return composeJsonResponse(200, "", context)


@login_required
def update(request):
	# """ - Update Account Information """

	account = get_current_user(request)

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

	return composeJsonResponse(200, "", context)


@login_required
def update_caregiver(request):
	# """ -Updates Account's Caregiver Information. """

	account = get_current_user(request)
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

	return composeJsonResponse(200, "", context)

@login_required
def profile(request, account_id):
	# """ -Retrieve Profile With Account ID """

	account = Account.objects.get(id=account_id)
	context = {
		'account': account
	}

	return composeJsonResponse(200, "", context)

@login_required
def caregiver_info(request, account_id):
	# """ -Retrieve Caregiver Details for an Account """

    caregiver = CareGiver.objects.get(account=account_id)
	context = {
        'caregiver': caregiver
    }
	return composeJsonResponse(200, "", context)

def get_invite(token):
	if not token:
		raise Exception("Invitation token is not specified")

	invitation = OrgInvite.objects.get(token=token)
	if not invitation:
		raise Exception("Invitation token is invalid.")

	return invitation


def invite_accept_redirect(token):
	# """ -Redirects to the accept invite frontend view with pre-fetched data. """

	try:
		invite = get_invite(token)
		if not invite:
			raise Exception("Invitation token is invalid")
		if invite.used:
			invite = {'used': True}
	except:
		invite = {'invalid': True}
		raise Exception("Resource not found.")

	base = "home/accept"

	url = '{}/{}?data={}'.format(base, token, urllib.quote_plus(json.dumps(invite)))
	# local-url = localhost:8000/home/accept/234512?data={'id':'145','token':'234512','account_id':'137'} ......

	return redirect(url)

def generate_token(length):
	# """ -Returns randomly generate email token """

	return codecs.encode(os.urandom(length // 2), 'hex')


def verify(request, token):
	# """ -If verification token is valid, Account.email_verified = True """

	account = get_current_user(request)
	if not account.email:
		raise "No email found for account {}".format(account.id)

	email_serializer = URLSafeTimedSerializer(settings.SERIALIZER_SECRET_KEY, salt='email-token')

	rand = generate_token(4)
	data = (account.id, account.email_hash, rand)
	email_serializer.dumps(data)

	if not token:
		raise Exception("Invalid verification token")
	else:
		try:
			account_id, email_hash, rand = email_serializer.loads(token)
			if account.email_hash != email_hash:
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


	return redirect("account")

def get_current_user(request):
	user = request.user
	account = Account.objects.get(email=user.email, password=user.password)

	return account