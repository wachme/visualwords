from django.db import models
from django.core.urlresolvers import reverse

class Wordlist(models.Model):
    name = models.CharField(max_length=16)
    
    def get_absolute_url(self):
        return reverse('wordlist-detail', kwargs={'pk': self.pk})

class Word(models.Model):
    word = models.CharField(max_length=32)
    wordlist = models.ForeignKey(Wordlist)
    translation = models.CharField(max_length=32)
    image = models.FilePathField()
    usecases = models.TextField()