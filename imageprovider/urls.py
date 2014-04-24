from django.conf.urls import patterns, include, url
from imageprovider.views import Search

urlpatterns = patterns('',
    url(r'^$', Search.as_view(), name='search')
)
