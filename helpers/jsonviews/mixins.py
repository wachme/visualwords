import json
from django.http import HttpResponse
from django.db.models import Model
from django.db.models.query import QuerySet
from django.forms import model_to_dict
from django.core.exceptions import ImproperlyConfigured

class JsonResponseMixin(object):
    """
    Provides response in JSON format.
    """
    def render_to_json_response(self, data, encode=True, converter=None, **response_kwargs):
        def serialize(data, converter=None):
            def default(o):
                def _default(o):
                    if isinstance(o, QuerySet):
                        return list(o)
                    if isinstance(o, Model):
                        return model_to_dict(o)
                return converter(o, _default) if callable(converter) else _default(o)
                
            return json.dumps(data, default=default, ensure_ascii=False)
        
        response_kwargs['content_type'] = 'application/json'
        content = serialize(data, converter) if encode else data
        return HttpResponse(content, **response_kwargs)
   
class ContextJsonResponseMixin(JsonResponseMixin):  
    def render_to_response(self, context, **response_kwargs):
        return self.render_to_json_response(self.get_response_data(context))
    
    def get_response_data(self, context):
        raise ImproperlyConfigured('JsonResponseMixin requires implementation for get_response_data()')

class SingleObjectJsonResponseMixin(ContextJsonResponseMixin):
    def get_response_data(self, context):
        return context['object']
    
    
class MultipleObjectJsonResponseMixin(ContextJsonResponseMixin):
    def get_response_data(self, context):
        return context['object_list']
    
    
class FormJsonResponseMixin(ContextJsonResponseMixin):
    success_url = '/'
    default_data = {}
    
    def success_msg(self, form):
        return True
    
    def failure_msg(self, form):
        return form.errors
    
    def render_to_response(self, context, **response_kwargs):
        if self.request.method == 'GET':
            return self.render_to_json_response('GET method not allowed', status=405)
    
    def get_default_data(self):
        return self.default_data
    
    def get_form_kwargs(self):
        kwargs = super(FormJsonResponseMixin, self).get_form_kwargs()
        data = kwargs['data'].dict() if 'data' in kwargs else {}
        kwargs['data'] = dict(self.get_default_data(), **data)

        return kwargs
    
    def form_valid(self, form):
        super(FormJsonResponseMixin, self).form_valid(form)
        return self.render_to_json_response(self.success_msg(form))
    
    def form_invalid(self, form):
        super(FormJsonResponseMixin, self).form_invalid(form)
        return self.render_to_json_response(self.failure_msg(form), status=400)
    
    
class DeletionJsonResponseMixin(JsonResponseMixin):
    def success_msg(self):
        return True
    
    def failure_msg(self, error):
        return str(error)
    
    def delete(self, request, *args, **kwargs):
        self.object = self.get_object()
        try:
            self.object.delete()
            return self.render_to_json_response(self.success_msg())
        except Exception as e:
            return self.render_to_json_response(self.failure_msg(e), status=400)
        
    def post(self, request, *args, **kwargs):
        return self.delete(request, *args, **kwargs)