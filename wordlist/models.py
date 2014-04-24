from django.db import models

class Wordlist(models.Model):
    name = models.CharField(max_length=16)

class Word(models.Model):
    word = models.CharField(max_length=32)
    wordlist = models.ForeignKey(Wordlist)
    translation = models.CharField(max_length=32)
    image = models.URLField(blank=True)
    usecases = models.TextField(blank=True)