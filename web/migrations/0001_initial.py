# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('air_date', models.DateField(db_index=True)),
                ('show_number', models.PositiveIntegerField(db_index=True)),
                ('round', models.CharField(max_length=128)),
                ('category', models.CharField(max_length=256)),
                ('question', models.CharField(max_length=1024)),
                ('answer', models.CharField(max_length=512)),
                ('value', models.PositiveIntegerField()),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='question',
            unique_together=set([('show_number', 'category', 'answer')]),
        ),
    ]
