from __future__ import unicode_literals

import hashlib
from werkzeug.security import generate_password_hash, check_password_hash
from django.core import *

from django.db import models
from django.conf import settings
from django.contrib.auth.models import User


class Account(models.Model):
    email_verified = models.BooleanField(default=False)
    phone_verified = models.BooleanField(default=False)
    username = models.CharField(max_length=100, null=True)
    is_active = models.BooleanField(default=True)
    email = models.EmailField(max_length=255, null=True, blank=True, unique=True)
    password = models.CharField(max_length=120, null=True)
    first = models.CharField(max_length=35, null=True, blank=True)
    last = models.CharField(max_length=35, null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    stripe_customer_id = models.CharField(max_length=20, null=True, blank=True)


    # def password(self):
    #     return self.password

    def _set_password(self, raw):
        salted = raw + settings.SECRET_KEY
        self._password = generate_password_hash(salted)

    def check_password(self, other):
        salted = other + settings.SECRET_KEY
        return check_password_hash(self.password, salted)

    def email_hash(self):
        salted = self.email + settings.SECRET_KEY
        return hashlib.md5(salted.encode('utf-8')).hexdigest()

    def __unicode__(self):
        return ((self.first or '') + ' ' + (self.last or '')).strip()

    def gravatar_url(self):
        g = 'https://secure.gravatar.com/avatar/{}?d=retro'
        return g.format(hashlib.md5(self.email.encode('utf-8')).hexdigest())


class CareGiver(models.Model):
    account = models.ForeignKey(Account)
    is_hireable = models.BooleanField(default=False)
    location = models.CharField(max_length=255)
    about = models.TextField()
    certs = models.TextField()