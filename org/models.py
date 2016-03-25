from django.db import models
from account.models import Account


class Org(models.Model):
	actor_id = models.ForeignKey(Account, null=True)
	name = models.CharField(max_length=35, null=False)
	username = models.CharField(max_length=30, unique=True)
	logo_key = models.CharField(max_length=36)
	is_archived = models.BooleanField(default=False)
	is_public = models.BooleanField(default=False)
	description = models.TextField()

	def get_member(self):
		return self.OrgMember_set.all()

	def add_members(self, account_id, is_owner=False, is_admin=False):
		member = OrgMember(account_id=account_id, is_owner=is_owner, is_admin=is_admin)
		self.OrgMember_set.append(member)
		return member


class OrgMember(models.Model):
	org_id = models.ForeignKey(Org, on_delete=models.CASCADE, null=False)
	account_id = models.ForeignKey(Account, on_delete=models.CASCADE, null=False)
	status = models.CharField(max_length=50)
	is_active = models.BooleanField(default=True)
	is_owner = models.BooleanField(default=False)
	is_admin = models.BooleanField(default=False)


class OrgInvite(models.Model):
	token = models.CharField(max_length=16, unique=True, null=False)
	account_id = models.ForeignKey(Account, on_delete=models.CASCADE, null=False)
	org_id = models.ForeignKey(Org, on_delete=models.CASCADE, null=False)
	used = models.BooleanField(default=False)
	is_admin = models.BooleanField(default=False)
	name = models.CharField(max_length=70)
	email = models.CharField(max_length=255)
