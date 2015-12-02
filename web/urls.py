from django.conf.urls import patterns, url

from web.views.data import DataView
from web.views.home import HomeView


urlpatterns = patterns(
    '',
    url(r'^$', HomeView.as_view(), name='home'),
    url(r'^data$', DataView.as_view(), name='data'),
)
