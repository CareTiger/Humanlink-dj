import codecs
import logging
import os

from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.http import HttpResponse

from account.models import Account
from api_helpers import composeJsonResponse
from org.forms import NewOrg, OrgInviteEmail
from org.models import Org, OrgMember, OrgInvite
from account.views import get_current_user
from message.models import Thread, PRIVACY_CHOICES
import mandrill


# @login_required
def orgs(request):
	if request.method == "GET":
		return _orgs_get(request)
	else:
		return _orgs_post(request)


def _orgs_get(request):
	# """ Get the list of orgs the account is part of."""
	account = Account.objects.get(email=request.user.username)

	# all_orgs = Org.objects.join(Org.OrgMember_set).filter(OrgMember.account_id == account.id)

	all_orgs = []
	all_members = OrgMember.objects.all()
	for member in all_members:
		if member.account.email == account.email:
			org = Org.objects.get(id=member.org.id)

			all_members = []
			all_org_members = OrgMember.objects.filter(org=org)

			for org_member in all_org_members:
				memberObject = {
					'id': org_member.id,
					'name': org_member.account.username,
					'status': org_member.status,
					'profile': {
						'gravatar_url': org_member.account.gravatar_url(),
						'email': org_member.account.email
					}
				}
				all_members.append(memberObject)

			orgObject = {
				'id': org.id,
				'actor': account,
				'name': org.name,
				'username': org.username,
				'members': all_members
			}
			all_orgs.append(orgObject)

	context = {"all_orgs": all_orgs}
	return composeJsonResponse(200, "", context)


def _orgs_post(request):
	# """Create a new organization."""
	account = get_current_user(request)
	org = Org()

	form = NewOrg(request.POST)

	if form.is_valid():
		cleaned_data = form.cleaned_data

		username = Org.objects.get(username=cleaned_data['username'])
		if username:
			raise Exception('Username is already taken.')

		org.actor_id = account.id
		org.name = cleaned_data['name']
		org.username = cleaned_data['username']
		org.description = cleaned_data['description']
		org.is_public = cleaned_data['is_public']
		org.add_members(account.id)
		org.save()

		new_thread = Thread(org_id=org.id, name='welcome', purpose='Welcome to Humanlink!', privacy=PRIVACY_CHOICES(3))
		new_thread.save()

		logging.info('New org: org_id={}, actor_id={}'.format(org.id, org.actor_id))

	context = {"org": org}
	return composeJsonResponse(200, "", context)


@login_required
def invite_by_email(request, org_id):
	# """Invite a new member by email address to org."""

	account = get_current_user(request)
	token = codecs.encode(os.urandom(8), 'hex')
	org_invite = OrgInvite()

	if request.method == "POST":
		form = OrgInviteEmail(request.POST)

		if form.is_valid():
			cleaned_data = form.cleaned_data

			if not cleaned_data['email']:
				raise Exception("Email address is not specified, or is invalid.")

			member = OrgMember.objects.get(org_id=org_id, email=cleaned_data['email'])
			if member:
				raise Exception("Email address is already in team.")
			org_invitation = OrgInvite.objects.get(org_id=org_id, email=cleaned_data['email'], used=False)
			if org_invitation:
				raise Exception("Email address has already been invited.")

			email = cleaned_data['email'].strip().lower()

			org_invite.name = cleaned_data['name']
			org_invite.is_admin = cleaned_data['is_admin']
			org_invite.email = email
			org_invite.org_id = org_id
			org_invite.token = token
			org_invite.account_id = account
			org_invite.save()

			org = Org.objects.get(id=org_id)

			# Send Email

			url = 'https://www.humanlink.co/accept/{}'.format(org_invite.token)
			md = mandrill.Mandrill(settings.MANDRILL_API_KEY)
			message = {
				'to': [{
					'email': org_invite.email,
					'name': org_invite.name or ''
				}],
				'subject': 'You are invited to join {}'.format(org.name),
				'global_merge_vars': [
					{'name': 'INVITE_URL', 'content': url},
					{'name': 'NAME', 'content': org_invite.name or ''},
					{'name': 'ORG_NAME', 'content': org.name},
					{'name': 'INVITER_NAME', 'content': account.name},
				]
			}
			message['from_name'] = message.get('from_name', 'Humanlink')
			message['from_email'] = message.get('from_email', 'support@humanlink.co')
			try:
				md.messages.send_template(
					template_name='humanlink-org-invite', message=message,
					template_content=[], async=True)
			except mandrill.Error as e:
				logging.exception(e)
				raise Exception('Unknown service exception')

	else:
		form = OrgInviteEmail()

	context = {
		'message': 'ok'
	}

	return composeJsonResponse(200, "", context)
