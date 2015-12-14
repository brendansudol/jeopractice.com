import re

from bs4 import BeautifulSoup
from collections import defaultdict
from django.db import models
from textwrap import dedent


class ModelBase(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Question(ModelBase):
    air_date = models.DateField(db_index=True)
    show_number = models.PositiveIntegerField(db_index=True)
    round = models.CharField(max_length=128)
    category = models.CharField(max_length=256)
    question = models.CharField(max_length=1024)
    answer = models.CharField(max_length=512)
    amount = models.PositiveIntegerField(blank=True, null=True)

    class Meta:
        unique_together = ('show_number', 'category', 'answer', 'amount')

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

        # try to filter out double jeps
        if amt % 200 != 0 or amt > 2000:
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

    @classmethod
    def get_game(cls, show_number):
        questions = cls.objects.filter(show_number=show_number)

        by_category = defaultdict(list)
        for question in questions:
            q = question.to_dict()
            by_category[q['category']].append(q)

        return dict(by_category)
