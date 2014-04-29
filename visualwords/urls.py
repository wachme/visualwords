from django.conf.urls import patterns, include, url

api_patterns = [
    url(r'^', include('wordlist.urls')),
    url(r'^provider/', include('provider.urls'))
]

urlpatterns = patterns('',
    url(r'^api/', include(api_patterns)),
    url(r'^', include('client.urls'))
)
