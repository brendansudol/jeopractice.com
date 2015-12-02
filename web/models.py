from collections import defaultdict
from django.db import models


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

    @classmethod
    def get_game(cls, show_number=4680):
        questions = cls.objects.filter(show_number=show_number).values()

        by_category = defaultdict(list)
        for question in questions:
            by_category[question['category']].append(question)

        return dict(by_category)
