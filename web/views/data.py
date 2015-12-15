from django.http import JsonResponse
from django.views.generic import View

from web.models import Question


class DataView(View):
    def get(self, request):
        show_id = request.GET.get('id')
        questions = Question.objects.fetch_show(show_id)
        return JsonResponse({'questions': questions})
