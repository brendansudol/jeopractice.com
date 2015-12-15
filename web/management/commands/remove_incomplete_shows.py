import logging

from collections import defaultdict
from django.core.management import BaseCommand

from web.models import Question


logger = logging.getLogger(__name__)


class Command(BaseCommand):
    threshold = 60

    def handle(self, *args, **options):
        questions = Question.objects.all()
        grouped = defaultdict(list)

        for question in questions:
            grouped[question.show_number].append(question)

        incomplete_shows = []
        for show_id, quests in grouped.items():
            if len(quests) < self.threshold:
                incomplete_shows.append(show_id)

        incomplete_quests = Question.objects.filter(
            show_number__in=incomplete_shows
        )

        logger.info('removing {} questions ({} shows)'.format(
            incomplete_quests.count(),
            len(incomplete_shows),
        ))

        incomplete_quests.delete()
