from django.conf.urls import patterns, include, url
from views import *

urlpatterns = patterns('',
    url(r'^wordlists/$', WordlistList.as_view(), name='wordlist-list'),
    url(r'^wordlists/(?P<pk>\d+)$', WordlistDetail.as_view(), name='wordlist-detail'),
    
    url(r'^words/$', WordCreate.as_view(), name='word-create'),
    url(r'^words/(?P<pk>\d+)$', WordUpdate.as_view(), name='word-update')
)
