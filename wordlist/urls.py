from django.conf.urls import patterns, include, url
from wordlist import views

urlpatterns = patterns('',
    url(r'^$', views.WordlistList.as_view(), name='wordlist-list'),
    url(r'^(?P<pk>\d+)/$', views.WordlistDetail.as_view(), name='wordlist-detail'),
    url(r'^add/$', views.WordlistCreate.as_view(), name='wordlist-create'),
    url(r'^(?P<pk>\d+)/edit/$', views.WordlistUpdate.as_view(), name='wordlist-update'),
    url(r'^(?P<pk>\d+)/delete/$', views.WordlistDelete.as_view(), name='wordlist-delete'),
    
    url(r'^words/add/$', views.WordCreate.as_view(), name='word-create'),
    url(r'^(?P<wordlist_pk>\d+)/words/add/$', views.WordCreate.as_view(), name='wordlist-word-create'),
    url(r'^words/(?P<pk>\d+)/edit/$', views.WordUpdate.as_view(), name='word-update'),
    url(r'^words/(?P<pk>\d+)/delete/$', views.WordDelete.as_view(), name='word-delete')
)
