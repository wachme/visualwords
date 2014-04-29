from restless import modelviews as views
from models import *
from restless.models import serialize

class PartialUpdateMixin(object):
    def fill_data(self, request, *args, **kwargs):
        instance = self.get_instance(self, request, *args, **kwargs)
        request.data = dict(serialize(instance), **request.data)
        
    def patch(self, request, *args, **kwargs):
        self.fill_data(request, *args, **kwargs)
        return super(PartialUpdateMixin, self).put(request, *args, **kwargs)
    
# Wordlist views
    
class WordlistList(views.ListEndpoint):
    model = Wordlist

class WordlistDetail(PartialUpdateMixin, views.DetailEndpoint):
    model = Wordlist

    def serialize(self, obj):
        return serialize(obj, include=[ ('words', lambda o : serialize(o.word_set)) ])
    
# Word views

class WordCreate(views.ListEndpoint):
    model = Word
    methods = ['POST']

class WordUpdate(PartialUpdateMixin, views.DetailEndpoint):
    model = Word
    methods = ['PUT', 'DELETE']

