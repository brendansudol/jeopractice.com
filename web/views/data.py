from django.http import JsonResponse
from django.views.generic import View

from web.models import Question


class DataView(View):
    def get(self, request):
        gid = request.GET.get('id', 4680)
        game = Question.objects.fetch_show(gid)
        return JsonResponse({'game': game})
