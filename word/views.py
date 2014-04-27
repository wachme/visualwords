from helpers.jsonviews import View, FormView
from word import forms
from providers import GoogleImages, GoogleTranslations

from django.http import HttpResponse

class Images(FormView):
    form_class = forms.ImagesForm
    default_data = { 'n': 1 }
    provider = GoogleImages()
    
    def success_msg(self, form):
        return self.provider.findImages(**form.cleaned_data)
    
    
class Translations(FormView):
    form_class = forms.TranslationsForm
    provider = GoogleTranslations()
    
    def success_msg(self, form):
        return self.provider.findTranslations(**form.cleaned_data)
