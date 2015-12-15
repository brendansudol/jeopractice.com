from django.views.generic import TemplateView

from web.models import Question


class HomeView(TemplateView):
    template_name = 'web/home.html'

    def get_context_data(self, **kwargs):
        context = super(HomeView, self).get_context_data(**kwargs)
        context['show'] = self.get_show()
        return context

    def get_show(self):
        show_id = self.request.GET.get('id')

        if not show_id or not self.is_show_valid(show_id):
            show_id = Question.objects.get_random_show()

        return show_id

    def is_show_valid(self, show_id):
        try:
            q = Question.objects.filter(show_number=show_id)
            return q.exists()
        except Exception:
            return False
