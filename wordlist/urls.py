from django.conf.urls import patterns, include, url
from wordlist.views import WordlistList, WordlistDetail

urlpatterns = patterns('',
    url(r'^wordlists/$', WordlistList.as_view(), name='wordlists'),
    url(r'^wordlist/(?P<pk>\d+)$', WordlistDetail.as_view(), name='wordlist')
)
