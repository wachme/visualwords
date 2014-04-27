from django import forms

class ImagesForm(forms.Form):
    word = forms.CharField(max_length=32)
    n = forms.IntegerField(required=False)

class TranslationsForm(forms.Form):
    word = forms.CharField(max_length=32)
    s_lang = forms.CharField(max_length=5)
    t_lang = forms.CharField(max_length=5)