# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-06-23 18:45
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0009_auto_20160623_1109'),
    ]

    operations = [
        migrations.AlterField(
            model_name='careseeker',
            name='caregiver_needs',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='careseeker',
            name='team_name',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
