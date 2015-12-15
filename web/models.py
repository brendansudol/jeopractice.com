import re

from bs4 import BeautifulSoup
from collections import defaultdict
from datetime import date
from django.db import models
from django.db.models import Max
from random import randint
from textwrap import dedent


class ModelBase(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class QuestionManager(models.Manager):
    def get_random_show(self):
        _max = self.aggregate(Max('id'))['id__max']
        while True:
            try:
                return self.get(pk=randint(1, _max)).show_number
            except Exception:
                pass

    def fetch_show(self, show_number):
        questions = self.filter(show_number=show_number)
        grouped = defaultdict(list)

        for question in questions:
            key = '{}-{}'.format(
                self.model.ROUNDS.get(question.round, 0),
                question.category
            )
            grouped[key].append(question.to_dict())

        results = [
            x[1] for x in sorted(
                grouped.items(),
                key=lambda x: x[0]
            )
        ]

        return results


class Question(ModelBase):
    air_date = models.DateField(db_index=True)
    show_number = models.PositiveIntegerField(db_index=True)
    round = models.CharField(max_length=128)
    category = models.CharField(max_length=256)
    question = models.CharField(max_length=1024)
    answer = models.CharField(max_length=512)
    amount = models.PositiveIntegerField(blank=True, null=True)

    objects = QuestionManager()

    class Meta:
        unique_together = ('show_number', 'category', 'answer', 'amount')

    ROUNDS = {
        'Jeopardy!': 1,
        'Double Jeopardy!': 2,
        'Final Jeopardy!': 3,
    }

    @property
    def question_clean(self):
        soup = BeautifulSoup(self.question)
        txt = re.sub('\s+', ' ', soup.get_text()).strip()

        if not soup.a or 'mp3' not in soup.a.get('href'):
            return txt

        html = '''
        <div>{}</div>
        <audio controls>
          <source src="{}" type="audio/mpeg">
        </audio>
        '''.format(txt, soup.a.get('href'))

        return dedent(html)

    @property
    def amount_clean(self):
        amt = self.amount

        if self.round == 'Final Jeopardy!':
            return 'Final'

        if not amt:
            return ''

        # clue values doubled on 11/26/01
        scalar = 2 if self.air_date >= date(2001, 11, 26) else 1

        # try to filter out double jeps
        if amt % (100 * scalar) != 0 or amt > (1000 * scalar):
            return 'DD'

        return "${:,}".format(amt)

    def to_dict(self):
        return {
            'air_date': self.air_date,
            'show_number': self.show_number,
            'round': self.round,
            'category': self.category,
            'question': self.question_clean,
            'answer': self.answer,
            'amount': self.amount_clean,
        }
