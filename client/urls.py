from django.conf.urls import patterns, include, url
from client import views

urlpatterns = patterns('',
    url(r'^$', views.app, name='client-app'),
)
