import django.views.generic as views
import mixins
from django.views.generic import View

class View(mixins.JsonResponseMixin, View):
    pass

class DetailView(mixins.SingleObjectJsonResponseMixin, views.detail.BaseDetailView):
    pass

class ListView(mixins.MultipleObjectJsonResponseMixin, views.list.BaseListView):
    pass

class CreateView(mixins.FormJsonResponseMixin, views.edit.BaseCreateView):
    def success_msg(self, form):
        return self.object

class UpdateView(mixins.FormJsonResponseMixin, views.edit.BaseUpdateView):
    pass

class DeleteView(mixins.DeletionJsonResponseMixin, views.edit.BaseDetailView):
    pass