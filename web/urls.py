from django.conf.urls import patterns, url

from web.views.home import HomeView


urlpatterns = patterns(
    '',
    url(r'^$', HomeView.as_view(), name='home'),
)
