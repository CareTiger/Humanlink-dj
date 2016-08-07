from datetime import datetime

from django.db import models
from account.models import Account
from org.models import Org

THREADTYPE_CHOICES = (
    (0, 'Direct'),
    (1, 'Group')
)

THREADPURPOSE_CHOICES = (
    (0, 'General'),
    (1, 'Care')
)

GENDER_CHOICES = (
    (0, 'Other'),
    (1, 'Female'),
    (2, 'Male')
)

PRIVACY_CHOICES = (
    (0, 'Open'),  # see notes file - messages 1
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
    kind = models.IntegerField(choices=OWNER_CHOICES, default=0, null=False)
    privacy = models.IntegerField(choices=PRIVACY_CHOICES, null=True, default=1)
    account = models.ForeignKey(Account, related_name="thread_account_id", null=True)
    owner = models.ForeignKey(Account, related_name="thread_owner_id")
    org = models.ForeignKey(Org, related_name="thread_org_id", null=True)
    name = models.CharField(max_length=30, null=False)
    is_archived = models.BooleanField(default=False)
    purpose_type = models.IntegerField(choices=THREADPURPOSE_CHOICES, null=False,
                                       default=0)
    purpose = models.TextField(max_length=500, null=True, default="")
    hours = models.IntegerField(default=0, null=True)
    hobbies = models.TextField(max_length=500, null=True, default="")
    gender = models.IntegerField(choices=GENDER_CHOICES, default=0, null=True)
    notes = models.TextField(max_length=500, null=True, default="")


@property
def owner_kind(self):
    return self.kind


def get_members(self):
    return self.threadmember_set.all()


def add_members(self, account_id):
    member = ThreadMember.objects.get(account=account_id)
    self.threadmembers.add(member)
    return member


def __str__(self):
    return self.name


class ThreadMember(models.Model):
    thread = models.ForeignKey(Thread, related_name="threadmembers",
                               on_delete=models.CASCADE, null=False)
    account = models.ForeignKey(Account, related_name="threadmember_account_id",
                                null=True)
    last_seen = models.DateTimeField(auto_now=True)

    """Moves the read cursor to the given timestamp. Default is now."""

    def update_seen(self, ts=None):
        self.last_seen = ts

    def __str__(self):
        return self.account.email + ' ( ' + self.thread.name + " )"


class ThreadChat(models.Model):
    thread = models.ForeignKey(Thread, related_name="threadchat_thread_id",
                               on_delete=models.CASCADE, null=False)
    account = models.ForeignKey(Account, related_name="threadchat_account_id", null=True)
    kind = models.IntegerField(null=False, choices=CHAT_CHOICES, default=0)
    inviter = models.IntegerField(null=True, blank=True)
    remover = models.IntegerField(null=True, blank=True)
    text = models.TextField()
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.account.email + "'s chat for " + self.thread.name


class ThreadInvite(models.Model):
    actor = models.ForeignKey(Account, related_name="threadinvite_actor_id", null=True)
    thread = models.ForeignKey(Thread, related_name="threadinvite_thread_id",
                               on_delete=models.CASCADE, null=False)
    token = models.CharField(max_length=16, unique=True, null=False)
    shareable = models.BooleanField(default=False)
    phone = models.CharField(max_length=10)
    name = models.CharField(max_length=70)
    email = models.EmailField(max_length=255)

    def __str__(self):
        return "Thread invite for " + self.actor.email
