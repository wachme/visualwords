import json
from django.http import HttpResponse
from encoder import ModelEncoder
from django.core.exceptions import ImproperlyConfigured

class JsonResponseMixin(object):
    """
    Provides response in JSON format
    """
    def render_to_response(self, context, **response_kwargs):
        response_kwargs['content_type'] = 'application/json'
        data = self.get_response_data(context)
        content = json.dumps(data, cls=ModelEncoder)
        return HttpResponse(content, response_kwargs)
    
    def get_response_data(self, context):
        raise ImproperlyConfigured("JsonResponseMixin requires implementation of get_response_data()")
    
class SingleObjectJsonResponseMixin(JsonResponseMixin):
    def get_response_data(self, context):
        return context['object']
    
class MultipleObjectJsonResponseMixin(JsonResponseMixin):
    def get_response_data(self, context):
        return context['object_list']
    