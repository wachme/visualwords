from django import forms

class ImagesForm(forms.Form):
    word = forms.CharField(max_length=32)
    n = forms.IntegerField(required=False)
    
    def clean_n(self):
        return (self.cleaned_data['n']
                if 'n' in self.cleaned_data and self.cleaned_data['n'] is not None
                else 1)

class TranslationsForm(forms.Form):
    word = forms.CharField(max_length=32)
    s_lang = forms.CharField(max_length=5)
    t_lang = forms.CharField(max_length=5)