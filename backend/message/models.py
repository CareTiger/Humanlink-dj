from datetime import datetime

from django.db import models
from account.models import Account
from org.models import Org

THREADTYPE_CHOICES = (
	(0, 'Direct'),
	(1, 'Group')
)

PRIVACY_CHOICES = (
	(0, 'Open'), # see notes file - messages 1
	(1, 'Closed'),
	(3, 'Members')
)

OWNER_CHOICES = (
	(0, 'User'),
	(1, 'Org')
)

CHAT_CHOICES = (
	(0, 'Text'),
	(1, 'System'),
	(2, 'Joined'),
	(3, 'Left'),
	(4, 'Archived'),
	(5, 'Unarchived'),
	(6, 'ThreadUpdated')
)


class Thread(models.Model):
	kind = models.IntegerField(choices=OWNER_CHOICES, null=False)
	privacy = models.IntegerField(choices=PRIVACY_CHOICES, default=1)
	account_id = models.ForeignKey(Account, related_name="thread_account_id", null=True)
	owner_id = models.ForeignKey(Account, related_name="thread_owner_id")
	org_id = models.ForeignKey(Org, related_name="thread_org_id")
	name = models.CharField(max_length=30, null=False)
	is_archived = models.BooleanField(default=False)
	purpose = models.TextField(max_length=500)

	@property
	def owner_kind(self):
		return self.kind

	def get_members(self):
		return self.threadmember_set.all()

	def add_members(self, account_id):
		member = ThreadMember.objects.get(account_id=account_id)
		self.threadmember_thread_id.add(member)
		return member


class ThreadMember(models.Model):
	thread_id = models.ForeignKey(Thread, related_name="threadmember_thread_id", on_delete=models.CASCADE, null=False)
	account_id = models.ForeignKey(Account, related_name="threadmember_account_id", null=True)
	last_seen = models.DateTimeField(auto_now=True)

	"""Moves the read cursor to the given timestamp. Default is now."""
	def update_seen(self, ts=None):
		self.last_seen = ts


class ThreadChat(models.Model):
	thread_id = models.ForeignKey(Thread, related_name="threadchat_thread_id", on_delete=models.CASCADE, null=False)
	account_id = models.ForeignKey(Account, related_name="threadchat_account_id", null=True)
	kind = models.IntegerField(null=False, choices=CHAT_CHOICES, default=0)
	inviter = models.IntegerField()
	remover = models.IntegerField()
	created_on = models.DateTimeField(auto_now_add=True)
	text = models.TextField()



class ThreadInvite(models.Model):
	actor_id = models.ForeignKey(Account, related_name="threadinvite_actor_id", null=True)
	thread_id = models.ForeignKey(Thread, related_name="threadinvite_thread_id", on_delete=models.CASCADE, null=False)
	token = models.CharField(max_length=16, unique=True, null=False)
	shareable = models.BooleanField()
	phone = models.CharField(max_length=10)
	name = models.CharField(max_length=70)
	email = models.EmailField(max_length=255)