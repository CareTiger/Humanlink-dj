import urllib

import codecs
import os
import logging

from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.forms.models import model_to_dict
from django.http import HttpResponse
from itsdangerous import URLSafeTimedSerializer
from django.conf import settings
import json
from django.shortcuts import render, redirect
from api_helpers import composeJsonResponse
from account.models import Account, CareGiver, CareSeeker
from message.models import Thread, ThreadChat, CHAT_CHOICES, ThreadMember, ThreadInvite
from org.models import Org, OrgInvite, OrgMember
# from third_party import pusher
from .forms import BasicInfo, CareGiverInfo, LoginForm, AcceptInvite, SignUp
from django.contrib.auth import logout
from django.http import QueryDict
import ast
from django.contrib.auth import authenticate, login as auth_login
from django.contrib import messages
import mandrill
from django.views.decorators.csrf import csrf_exempt

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

def broadcast(chat_id=None):
	# """Sends out push notifications to thread members about chat message. """

	def chunks(li, n):
		"""Yields n-sized chunks from the list."""
		for i in xrange(0, len(li), n):
			yield li[i:i + n]

	chat = ThreadChat.objects.get(id=chat_id)
	thread = Thread.objects.get(id=chat.thread.id)

	if not chat or not thread:
		raise Exception("thread or chat not found")

	all_members = ThreadMember.objects.filter(thread=thread)

	partition = chunks(all_members, 10)
	for part in partition:
		channels = ['private-account-{}'.format(m.account.id) for m in part]
		# pusher.trigger(channels, 'message.new', {'thread_id': thread.id, 'chat': chat})


def add_to_welcome(org_id, account_id, inviter_id):

	thread = Thread.objects.get(org=org_id, name="welcome")
	if thread:

		thread_member = ThreadMember.objects.create(account=account_id, thread=thread)
		thread.add_members(account_id)

		chat = ThreadChat.objects.create(thread=thread, account=account_id, text=account_id, kind=2, inviter=2, remover=3)
		chat.save()

		broadcast(chat_id=chat.id)

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
						messages.error(form.request, 'Please enter an email and password.')
						return form.ValidationError("Error")
					else:
						form.cached_user = authenticate(username=email[:30], password=password)

						auth_login(request, form.cached_user)

						if form.cached_user is None:
							form.errors["password"] = form.error_class(["Password incorrect. Passwords are case sensitive."])
						elif not form.cached_user.is_active:
							messages.error(form.request,
										   'This account is inactive. Please check your inbox for our confirmation email, and '
										   'click the link within to activate your account.')
							raise form.ValidationError("Error")

						account = Account.objects.get(email=email, password=password)

						if cleaned_data['invite']:

							token = cleaned_data['invite']
							if ThreadInvite.objects.filter(token=token):
								threadInvite = ThreadInvite.objects.get(token=token)
								thread = Thread.objects.get(id=threadInvite.thread.id)
								ThreadMember.objects.create(account=account, thread=thread)
							elif OrgInvite.objects.filter(token=token):
								orgInvite = OrgInvite.objects.get(token=token)
								if orgInvite.used:
									raise Exception("Invitation token has already been used.")

								org = Org.objects.get(id=orgInvite.org.id)
								org_member = OrgMember.objects.filter(account=account, org=org)

								if org_member:
									raise Exception("Account is already in team.")
								else:
									OrgMember.objects.create(account=account, org=org)
									invite.used = False
							else:
								raise Exception("Invitation token is invalid.")



								# add_to_welcome(org_id=org.id, account_id=account.id, inviter_id=invite.token)

						context = {
							'message': form.errors,
							'next': '/app/'
						}

						return composeJsonResponse(200, "", context)


def logout_user(request):
	logout(request)


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
				invite_token = cleaned_data['invite']

				account = Account.objects.create(email=email, password=password)
				if len(email) > 30:
					User.objects.create_user(email, email, password)
				else:
					email = email[:30]
					User.objects.create_user(email, email, password)

				if ThreadInvite.objects.filter(token=invite_token):
					invitation = ThreadInvite.objects.get(token=invite_token)
					thread = Thread.objects.get(id=invitation.thread.id)
					ThreadMember.objects.create(thread=thread, account=account)
				else:
					invitation = OrgInvite.objects.get(token=invite_token)
					if invitation.used:
						raise Exception("invitation code is invalid")
					if org_username and org_name:
						Org.objects.create(name=org_name, username=org_username)
						invitation.used = False
						invitation.save()

				login(request)

				# Send Email
				if account.email == 'tim@millcreeksoftware.biz':
					md = mandrill.Mandrill('0Ub_zOSRJBIIhpN9bbqpwA')
					t = invite_token.replace(' ', '+')
					url = "https://localhost:8000/verify/{}".format(t)
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
						raise Exception(e)

				context = {
					'message': 'ok'
				}

				return composeJsonResponse(200, "", context)

			else:
				raise Exception(form.errors)

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

@login_required
def me(request):
	# """ - Retrieve Current Account Information in JSON Format """

	account = get_current_user(request)

	context = {
		"account": account
	}

	return composeJsonResponse(200, "", context)


# @login_required
@csrf_exempt
def update(request):
	# """ - Update Account Information """

	account = Account.objects.get(email=request.user.email)

	if request.method == "POST":
		form = BasicInfo(requestPost(request))

		if form.is_valid():

			cleaned_data = form.cleaned_data
			account.first = cleaned_data['first']
			account.last = cleaned_data['last']
			account.phone = cleaned_data['phone_number']
			account.save()

			context = {
				'account': 'test'
			}

			return composeJsonResponse(200, "", context)


# @login_required
def update_caregiver(request):
	# """ -Updates Account's Caregiver Information. """

	account = Account.objects.get(email=request.user.username)
	caregiver = CareGiver.objects.get(account=account)

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

# @login_required
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

	invite_dict = model_to_dict(invite)

	url = '/{}/{}/?data={}'.format(base, token, urllib.quote_plus(json.dumps(invite_dict)))

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
			context = {
				'caregiver_list': caregiver_list
			}

			return composeJsonResponse(200, '', context)

def get_careseekers(request):
	# Return all careseekers who are 'public'
	if request.method == 'GET':
		careseekers_list = []
		careseekers = CareSeeker.objects.filter()
		for careseeker in careseekers:
			careseekers_list.append(careseeker)

		context = {
			'careseekers': careseekers
		}
		return composeJsonResponse(200, '', context)

	elif request.method == 'POST':
		context = {
			'message': 'post'
		}
		return composeJsonResponse(200, '', context)
