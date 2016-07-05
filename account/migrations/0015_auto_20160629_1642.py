# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-06-29 21:42
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0014_auto_20160628_1818'),
    ]

    operations = [
        migrations.AlterField(
            model_name='caregiver',
            name='certs',
            field=models.CharField(blank=True, choices=[('LPN', 'Licensed Practical Nurse (LPN)'), ('CNA', 'Certified Nursing Aide (CNA)'), ('IHA', 'In-Home Assistant) (IHA)'), ('HCS', 'Home Care Specialist (HCS)'), ('AD', 'Alzheimers & Dementia (AD)')], max_length=3),
        ),
        migrations.AlterField(
            model_name='caregiver',
            name='city',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='caregiver',
            name='location',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]