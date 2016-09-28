from __future__ import unicode_literals

import hashlib
from werkzeug.security import generate_password_hash, check_password_hash
from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

CERTIFICATES = (
    ('LPN', 'Licensed Practical Nurse (LPN)'),
    ('CNA', 'Certified Nursing Aide (CNA)'),
    ('IHA', 'In-Home Assistant) (IHA)'),
    ('HCS', 'Home Care Specialist (HCS)'),
    ('AD', 'Alzheimers & Dementia (AD)'),
)


class Account(models.Model):
    email_verified = models.BooleanField(default=False)
    phone_verified = models.BooleanField(default=False)
    username = models.CharField(max_length=100, null=True)
    is_active = models.BooleanField(default=True)
    email = models.EmailField(max_length=255, null=True, blank=True, unique=True)
    password = models.CharField(max_length=120, null=True)
    password_token = models.CharField(max_length=16, unique=True, null=True)
    first = models.CharField(max_length=35, null=True, blank=True)
    last = models.CharField(max_length=35, null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    stripe_customer_id = models.CharField(max_length=20, null=True, blank=True)

    def _set_password(self, raw):
        salted = raw + settings.SECRET_KEY
        encrypted_password = generate_password_hash(salted)
        return encrypted_password

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
    public = models.BooleanField(default=False)
    is_hireable = models.BooleanField(default=False, blank=True)
    location = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    certificates = models.TextField(null=True, blank=True)
    headline = models.CharField(max_length=200, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    allergies = models.TextField(null=True, blank=True)
    arrangements = models.TextField(null=True, blank=True)
    background_verified = models.BooleanField(default=False, blank=True)
    phone_verified = models.BooleanField(default=False, blank=True)
    offlineID_verified = models.BooleanField(default=False, blank=True)

    def __str__(self):
        return self.account.email


class CareSeeker(models.Model):
    account = models.ForeignKey(Account)
    public = models.BooleanField(default=False)
    team_name = models.CharField(max_length=100, null=False)
    mission = models.TextField(null=True, blank=True)
    main_phone = models.CharField(max_length=20, null=True, blank=True)
    website = models.CharField(max_length=100, null=True, blank=True)
    video = models.FileField(max_length=200, null=True, blank=True)
    email = models.FileField(max_length=200, null=True, blank=True)
    # Email and video will later have to be made into FileBrowser
    caregiver_needs = models.CharField(max_length=200, null=True)
    hoyer_lift = models.BooleanField(default=False)
    cough_assist = models.BooleanField(default=False)
    adaptive_utensil = models.BooleanField(default=False)
    meal_prep = models.BooleanField(default=False)
    housekeeping = models.BooleanField(default=False)
