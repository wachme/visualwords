from django.conf.urls import patterns, include, url
from word import views

urlpatterns = patterns('',
    url(r'^images/$', views.Images.as_view(), name='word-images'),
    url(r'^translations/$', views.Translations.as_view(), name='word-translations')
)