from django.conf.urls import patterns, include, url

from web.views.home import HomeView


urlpatterns = patterns('',
    url(r'^$', HomeView.as_view(), name='home'),
)
