import codecs
import os
from django.shortcuts import render

from api_helpers import ComposeJsonResponse
from org.forms import NewOrg, OrgInviteEmail
from org.models import Org, OrgMember, OrgInvite
from account.models import Account

@login_required
def orgs(request):
	if request.method == "GET":
		return _orgs_get(request)
	else:
		return _orgs_post(request)


def _orgs_get(request):
	""" Get the list of orgs the account is part of."""
	user = get_current_user(request)
	account = Account.objects.get(email=user.email, password=user.password)
	org = Org.objects.get(actor_id=account.id)

	context = {"org": org }
	return ComposeJsonResponse(200, "", context)


def _orgs_post(request):
	"""Create a new organization."""
	org = Org()

	if request.method == "POST":
		form = NewOrg(request._post)

		if form.is_valid():
			cleaned_data = form.cleaned_data
			org.actor_id = cleaned_data['org']
			org.name = cleaned_data['name']
			org.username = cleaned_data['username']
			org.logo_key = cleaned_data['logo_key']
			org.is_archived = cleaned_data['is_archived']
			org.is_public = cleaned_data['is_public']
			org.description = cleaned_data['description']
			org.save()
	else:
		form = NewOrg()

	context = {"org": org, "form": form}
	return ComposeJsonResponse(200, "", context)


@login_required
def invite_by_email(request, org_id):
	"""Invite a new member by email address to org."""

	# get values ready
	user = get_current_user(request)
	account = Account.objects.get(email=user.email, password=user.password)
	token = codecs.encode(os.urandom(8), 'hex')
	# create invite
	org_invite = OrgInvite()
	# filling invite with data
	org_invite.org_id = org_id
	org_invite.token = token
	org_invite.account_id = account

	if request.method == "POST":
		form = OrgInviteEmail(request._post)

		if form.is_valid():
			cleaned_data = form.cleaned_data
			org_invite.name = cleaned_data['name']
			org_invite.email = cleaned_data['email']
			org_invite.is_admin = cleaned_data['is_admin']
			org_invite.save()

	else:
		form = OrgInviteEmail()

	# send email to person with invite
	# TODO in old project go to humanlink/tasks/emails.py line 43 to finish email invite

	context = {}
	return ComposeJsonResponse(200, "", context)


def get_current_user(request):
	user = request.user

	return user
