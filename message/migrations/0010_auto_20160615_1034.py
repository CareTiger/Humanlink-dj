# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-06-15 15:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('message', '0009_auto_20160614_1807'),
    ]

    operations = [
        migrations.AlterField(
            model_name='thread',
            name='gender',
            field=models.IntegerField(choices=[(0, b'Other'), (1, b'Female'), (2, b'Male')], default=0),
        ),
    ]