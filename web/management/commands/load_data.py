import json
import logging
import re

from datetime import date
from django.core.management import BaseCommand

from web.models import Question


logger = logging.getLogger(__name__)


class Command(BaseCommand):
    default_filename = 'data/questions-chunk1.json'
    batch_size = 1000

    def add_arguments(self, parser):
        parser.add_argument(
            '-f', '--filename',
            default=self.default_filename,
            help='input filename (.csv)'
        )

        parser.add_argument(
            '-a', '--append',
            dest='replace',
            action='store_false',
            default=True,
            help='Append data (default is to replace).'
        )

    def handle(self, *args, **options):
        if options['replace']:
            logger.info('erasing existing questions')
            Question.objects.all().delete()

        with open(options['filename']) as f:
            data = json.load(f)

        data_batches = self.chunks(data, self.batch_size)
        logger.info('{} batches of {} ({} total)'.format(
            len(data_batches), self.batch_size, len(data)
        ))

        for i, data_batch in enumerate(data_batches):
            logger.info('loading batch {}...'.format(i + 1))
            questions = []
            for d in data_batch:
                try:
                    question = Question(
                        air_date=self.parse_date(d['air_date']),
                        show_number=self.parse_int(d['show_number']),
                        round=d['round'],
                        category=d['category'],
                        question=d['question'][1:-1],
                        answer=d['answer'],
                        amount=self.parse_int(d['value']),
                    )
                    question.full_clean()
                    questions.append(question)
                except Exception:
                    logger.error('error parsing {}'.format(d))
                    raise
            Question.objects.bulk_create(questions)

    @staticmethod
    def chunks(l, n):
        return [l[i:i+n] for i in range(0, len(l), n)]

    @staticmethod
    def parse_int(x):
        if not x:
            return None

        return int(re.sub('\D', '', x))

    @staticmethod
    def parse_date(s):
        if not s:
            return None

        year, month, day = list(map(int, s.split('-')))
        return date(year, month, day)
