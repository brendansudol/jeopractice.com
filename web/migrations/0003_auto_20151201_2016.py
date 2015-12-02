# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0002_auto_20151201_2009'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='question',
            unique_together=set([('show_number', 'category', 'answer', 'amount')]),
        ),
    ]
