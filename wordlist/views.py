from helpers import jsonviews
from models import Wordlist, Word

# Wordlist views

class WordlistList(jsonviews.ListView):
    model = Wordlist
    
class WordlistDetail(jsonviews.DetailView):
    model = Wordlist

    def render_to_response(self, context, **response_kwargs):
        return self.render_to_json_response(self.get_response_data(context), converter=
                                            lambda o, default : dict(default(o), words=o.word_set.all())
                                                if isinstance(o, Wordlist)
                                                else default(o))
    
    
class WordlistCreate(jsonviews.CreateView):
    model = Wordlist
    
class WordlistUpdate(jsonviews.UpdateView):
    model = Wordlist
    
class WordlistDelete(jsonviews.DeleteView):
    model = Wordlist

# Word views

class WordCreate(jsonviews.CreateView):
    model = Word
    
    def get_form_kwargs(self):
        kwargs = super(WordCreate, self).get_form_kwargs()
        if 'wordlist_pk' in self.kwargs:
            kwargs['data'] = kwargs['data'].copy()
            kwargs['data']['wordlist'] = self.kwargs['wordlist_pk']
        return kwargs
        
        
class WordUpdate(jsonviews.UpdateView):
    model = Word
    
class WordDelete(jsonviews.DeleteView):
    model = Word