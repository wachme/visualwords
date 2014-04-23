from django.conf.urls import patterns, include, url
from wordlist.views import WordlistList, WordlistDetail, WordlistCreate, WordlistUpdate, WordlistDelete

urlpatterns = patterns('',
    url(r'^$', WordlistList.as_view(), name='wordlist-list'),
    url(r'^(?P<pk>\d+)/$', WordlistDetail.as_view(), name='wordlist-detail'),
    url(r'^add/$', WordlistCreate.as_view(), name='wordlist-create'),
    url(r'^(?P<pk>\d+)/edit/$', WordlistUpdate.as_view(), name='wordlist-update'),
    url(r'^(?P<pk>\d+)/delete/$', WordlistDelete.as_view(), name='wordlist-delete')
)
