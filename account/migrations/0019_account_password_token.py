# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-09-24 17:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0018_caregiver_public'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='password_token',
            field=models.CharField(max_length=16, null=True, unique=True),
        ),
    ]
