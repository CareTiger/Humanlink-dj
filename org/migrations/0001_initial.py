# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Org',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=35)),
                ('username', models.CharField(unique=True, max_length=30)),
                ('logo_key', models.CharField(max_length=36)),
                ('is_archived', models.BooleanField(default=False)),
                ('is_public', models.BooleanField(default=False)),
                ('description', models.TextField()),
                ('actor_id', models.ForeignKey(to='account.Account', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='OrgInvite',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('token', models.CharField(unique=True, max_length=16)),
                ('used', models.BooleanField(default=False)),
                ('is_admin', models.BooleanField(default=False)),
                ('name', models.CharField(max_length=70)),
                ('email', models.CharField(max_length=255)),
                ('account_id', models.ForeignKey(to='account.Account')),
                ('org_id', models.ForeignKey(to='org.Org')),
            ],
        ),
        migrations.CreateModel(
            name='OrgMember',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('status', models.CharField(max_length=50)),
                ('is_active', models.BooleanField(default=True)),
                ('is_owner', models.BooleanField(default=False)),
                ('is_admin', models.BooleanField(default=False)),
                ('account_id', models.ForeignKey(to='account.Account')),
                ('org_id', models.ForeignKey(to='org.Org')),
            ],
        ),
    ]
