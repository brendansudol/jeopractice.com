import json

from django.core.management import BaseCommand


class Command(BaseCommand):
    default_filename = 'data/questions-chunk1.json'

    def add_arguments(self, parser):
        parser.add_argument(
            '-f', '--filename', 
            default=self.default_filename,
            help='input filename (.csv)'
        )

    def handle(self, *args, **options):
        with open(options['filename']) as f:
            data = json.load(f)

        for d in data[:10]:
            print(d)
