from django.http import JsonResponse
from django.views.generic import View

from web.models import Question


class DataView(View):
    def get(self, request):
        gid = request.GET.get('id')
        game = Question.get_game(gid or 4680)
        return JsonResponse({'game': game})
