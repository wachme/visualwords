from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=16)

class Wordlist(models.Model):
    name = models.CharField(max_length=16)
    category = models.ForeignKey(Category)

class Word(models.Model):
    word = models.CharField(max_length=32)
    wordlist = models.ForeignKey(Wordlist)
    translation = models.CharField(max_length=32)
    image = models.FilePathField()
    usecases = models.TextField()