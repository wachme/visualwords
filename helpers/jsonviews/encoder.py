from django.forms import model_to_dict
from django.db.models import Model
from django.db.models.query import QuerySet
from json import JSONEncoder

class ModelEncoder(JSONEncoder):
    def default(self, o):
        if isinstance(o, QuerySet):
            return list(o)
        if isinstance(o, Model):
            return model_to_dict(o)
        return super(Encoder, self).default(o)