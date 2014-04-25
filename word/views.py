from helpers.jsonviews import View
from providers import GoogleImages, GoogleTranslations

class Images(View):
    provider = GoogleImages()
    
    def post(self, request, *args, **kwargs):
        if not 'word' in request.POST:
            return self.render_to_json_response('"word" parameter required', status=400)
        data = self.provider.findImages(request.POST.get('word'), request.POST.get('n', 1))
        return self.render_to_json_response(data)
    
class Translations(View):
    provider = GoogleTranslations()
    
    def post(self, request, *args, **kwargs):
        if not 'word' in request.POST:
            return self.render_to_json_response('"word" parameter required', status=400)
        data = self.provider.findTranslations(request.POST.get('word'))
        return self.render_to_json_response(data)