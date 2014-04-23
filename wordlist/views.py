from helpers import jsonviews
from models import Wordlist

class WordlistList(jsonviews.ListView):
    model = Wordlist
    
class WordlistDetail(jsonviews.DetailView):
    model = Wordlist
    
class WordlistCreate(jsonviews.CreateView):
    model = Wordlist
    
class WordlistUpdate(jsonviews.UpdateView):
    model = Wordlist
    
class WordlistDelete(jsonviews.DeleteView):
    model = Wordlist
