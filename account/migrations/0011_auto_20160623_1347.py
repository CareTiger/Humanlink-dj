# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-06-23 18:47
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0010_auto_20160623_1345'),
    ]

    operations = [
        migrations.AlterField(
            model_name='careseeker',
            name='mission',
            field=models.TextField(null=True),
        ),
    ]
