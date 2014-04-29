from django.conf.urls import patterns, include, url
import views

urlpatterns = patterns('',
    url(r'^images/$', views.Images.as_view(), name='provider-images'),
    url(r'^translations/$', views.Translations.as_view(), name='provider-translations')
)
