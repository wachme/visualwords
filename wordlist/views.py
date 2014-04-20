from django.views.generic import ListView, DetailView
from models import Wordlist

class WordlistList(ListView):
    model = Wordlist
    
class WordlistDetail(DetailView):
    model = Wordlist