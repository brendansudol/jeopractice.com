from django.http import JsonResponse
from django.views.generic import View

from web.models import Question


class DataView(View):
    def get(self, request):
        game = Question.get_game()
        return JsonResponse({'game': game})
