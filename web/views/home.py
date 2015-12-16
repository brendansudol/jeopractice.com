from django.views.generic import TemplateView

from web.models import Question


class HomeView(TemplateView):
    template_name = 'web/home.html'

    def get_context_data(self, **kwargs):
        context = super(HomeView, self).get_context_data(**kwargs)
        context['random_q'] = self.get_question() or Question.objects.random()
        return context

    def get_question(self):
        show_id = self.request.GET.get('id')

        if not show_id:
            return

        try:
            q = Question.objects.filter(show_number=show_id)
        except Exception:
            return

        return q.first()
