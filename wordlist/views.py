from restless import modelviews as views
from models import *
from restless.models import serialize

class WordlistList(views.ListEndpoint):
    model = Wordlist

class WordlistDetail(views.DetailEndpoint):
    model = Wordlist
    
    def fill_data(self, request, *args, **kwargs):
        instance = self.get_instance(self, request, *args, **kwargs)
        request.data = dict(serialize(instance), **request.data)
        
    def put(self, request, *args, **kwargs):
        self.fill_data(request, *args, **kwargs)
        return super(WordlistDetail, self).put(request, *args, **kwargs)
    
    def serialize(self, obj):
        return serialize(obj, include=[ ('words', lambda o : serialize(o.word_set)) ])
    

class WordCreate(views.ListEndpoint):
    model = Word
    methods = ['POST']

class WordUpdate(views.DetailEndpoint):
    model = Word
    methods = ['PUT', 'DELETE']

