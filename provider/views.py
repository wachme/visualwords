from restless.views import Endpoint
from restless.http import HttpError

from forms import *
from providers import *

class Images(Endpoint):
    provider = GoogleImages()
    
    def post(self, request):
        form = ImagesForm(request.data)
        if(form.is_valid()):
            return self.provider.findImages(**form.cleaned_data)
        
        raise HttpError(400, 'Invalid Data', errors=form.errors)
    
    
class Translations(Endpoint):
    provider = GoogleTranslations()
    
    def post(self, request):
        form = TranslationsForm(request.data)
        if(form.is_valid()):
            return self.provider.findTranslations(**form.cleaned_data)
        
        raise HttpError(400, 'Invalid Data', errors=form.errors)