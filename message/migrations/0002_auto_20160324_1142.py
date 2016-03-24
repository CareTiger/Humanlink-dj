# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '__first__'),
        ('message', '0001_initial'),
        ('org', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='thread',
            name='org_id',
            field=models.ForeignKey(related_name='thread_org_id', to='org.Org'),
        ),
        migrations.AddField(
            model_name='thread',
            name='owner_id',
            field=models.ForeignKey(related_name='thread_owner_id', to='account.Account'),
        ),
    ]
