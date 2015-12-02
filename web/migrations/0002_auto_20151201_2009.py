# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='value',
        ),
        migrations.AddField(
            model_name='question',
            name='amount',
            field=models.PositiveIntegerField(null=True, blank=True),
        ),
    ]
