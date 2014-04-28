from django.conf.urls import patterns, include, url

api_patterns = [
    url(r'^', include('wordlist.urls')),
    url(r'^', include('word.urls'))
]

urlpatterns = patterns('',
    url(r'^api/', include(api_patterns)),
    url(r'^', include('client.urls'))
)
