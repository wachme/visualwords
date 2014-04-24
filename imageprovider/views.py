from helpers.jsonviews import View
from providers import GoogleProvider

class Search(View):
    def __init__(self):
        self._provider = None
    
    def post(self, request, *args, **kwargs):
        if not 'word' in request.POST:
            return self.render_to_json_response('"word" parameter required', status=400)
        return self.render_to_json_response(self._get_provider().search(request.POST['word']))

    def _get_provider(self):
        if not self._provider:
            self._provider = GoogleProvider()
        return self._provider
    