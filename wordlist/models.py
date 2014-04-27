from django.db import models

class Wordlist(models.Model):
    name = models.CharField(max_length=16)
    s_lang = models.CharField(max_length=5)
    t_lang = models.CharField(max_length=5)

class Word(models.Model):
    word = models.CharField(max_length=32)
    wordlist = models.ForeignKey(Wordlist)
    translation = models.CharField(max_length=32)
    image = models.URLField(null=True, blank=True)
    usecases = models.TextField(null=True, blank=True)