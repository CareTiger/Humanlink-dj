# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('account', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Thread',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('kind', models.IntegerField()),
                ('privacy', models.IntegerField(default=1, choices=[(0, b'Open'), (1, b'Closed'), (3, b'Members')])),
                ('name', models.CharField(max_length=30)),
                ('is_archived', models.BooleanField(default=False)),
                ('purpose', models.TextField(max_length=500)),
                ('account_id', models.ForeignKey(related_name='thread_account_id', to='account.Account', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ThreadChat',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('kind', models.IntegerField(default=0, choices=[(0, b'Text'), (1, b'System'), (2, b'Joined'), (3, b'Left'), (4, b'Archived'), (5, b'Unarchived'), (6, b'ThreadUpdated')])),
                ('inviter', models.IntegerField()),
                ('remover', models.IntegerField()),
                ('text', models.TextField()),
                ('account_id', models.ForeignKey(related_name='threadchat_account_id', to='account.Account', null=True)),
                ('thread_id', models.ForeignKey(related_name='threadchat_thread_id', to='message.Thread')),
            ],
        ),
        migrations.CreateModel(
            name='ThreadInvite',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('token', models.CharField(unique=True, max_length=16)),
                ('shareable', models.BooleanField()),
                ('phone', models.CharField(max_length=10)),
                ('name', models.CharField(max_length=70)),
                ('email', models.EmailField(max_length=255)),
                ('actor_id', models.ForeignKey(related_name='threadinvite_actor_id', to='account.Account', null=True)),
                ('thread_id', models.ForeignKey(related_name='threadinvite_thread_id', to='message.Thread')),
            ],
        ),
        migrations.CreateModel(
            name='ThreadMember',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('last_seen', models.DateTimeField(default=datetime.datetime)),
                ('account_id', models.ForeignKey(related_name='threadmember_account_id', to='account.Account', null=True)),
                ('thread_id', models.ForeignKey(related_name='threadmember_thread_id', to='message.Thread')),
            ],
        ),
    ]
