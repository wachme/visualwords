import django.views.generic as views
import mixins
from django.views.generic import View
from django.forms import model_to_dict

class View(mixins.JsonResponseMixin, View):
    pass

class FormView(mixins.FormJsonResponseMixin, views.FormView):
    pass

class DetailView(mixins.SingleObjectJsonResponseMixin, views.detail.BaseDetailView):
    pass

class ListView(mixins.MultipleObjectJsonResponseMixin, views.list.BaseListView):
    pass

class CreateView(mixins.FormJsonResponseMixin, views.edit.BaseCreateView):
    def success_msg(self, form):
        return self.object

class UpdateView(mixins.FormJsonResponseMixin, views.edit.BaseUpdateView):
    def get_default_data(self):
        return model_to_dict(self.object)

class DeleteView(mixins.DeletionJsonResponseMixin, views.edit.BaseDetailView):
    pass