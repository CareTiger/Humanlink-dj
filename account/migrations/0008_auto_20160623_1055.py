# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-06-23 15:55
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0007_auto_20160517_2100'),
    ]

    operations = [
        migrations.AlterField(
            model_name='careseeker',
            name='mission',
            field=models.TextField(),
        ),
    ]
