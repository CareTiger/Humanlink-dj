# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-03-30 18:15
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('account', '0001_initial'),
        ('org', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Thread',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('kind', models.IntegerField(choices=[(0, b'User'), (1, b'Org')])),
                ('privacy', models.IntegerField(choices=[(0, b'Open'), (1, b'Closed'), (3, b'Members')], default=1)),
                ('name', models.CharField(max_length=30)),
                ('is_archived', models.BooleanField(default=False)),
                ('purpose', models.TextField(max_length=500)),
                ('account_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='thread_account_id', to='account.Account')),
                ('org_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='thread_org_id', to='org.Org')),
                ('owner_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='thread_owner_id', to='account.Account')),
            ],
        ),
        migrations.CreateModel(
            name='ThreadChat',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('kind', models.IntegerField(choices=[(0, b'Text'), (1, b'System'), (2, b'Joined'), (3, b'Left'), (4, b'Archived'), (5, b'Unarchived'), (6, b'ThreadUpdated')], default=0)),
                ('inviter', models.IntegerField()),
                ('remover', models.IntegerField()),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('text', models.TextField()),
                ('account_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='threadchat_account_id', to='account.Account')),
                ('thread_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='threadchat_thread_id', to='message.Thread')),
            ],
        ),
        migrations.CreateModel(
            name='ThreadInvite',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.CharField(max_length=16, unique=True)),
                ('shareable', models.BooleanField()),
                ('phone', models.CharField(max_length=10)),
                ('name', models.CharField(max_length=70)),
                ('email', models.EmailField(max_length=255)),
                ('actor_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='threadinvite_actor_id', to='account.Account')),
                ('thread_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='threadinvite_thread_id', to='message.Thread')),
            ],
        ),
        migrations.CreateModel(
            name='ThreadMember',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_seen', models.DateTimeField(auto_now=True)),
                ('account_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='threadmember_account_id', to='account.Account')),
                ('thread_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='threadmember_thread_id', to='message.Thread')),
            ],
        ),
    ]
