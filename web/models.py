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
    value = models.PositiveIntegerField()

    class Meta:
        unique_together = ('show_number', 'category', 'answer')
