import django.views.generic as views
import mixins

class DetailView(mixins.SingleObjectJsonResponseMixin, views.detail.BaseDetailView):
    pass

class ListView(mixins.MultipleObjectJsonResponseMixin, views.list.BaseListView):
    pass

class CreateView(mixins.JsonResponseMixin, views.edit.BaseCreateView):
    pass

class UpdateView(mixins.JsonResponseMixin, views.edit.BaseUpdateView):
    pass

class DeleteView(mixins.JsonResponseMixin, views.edit.BaseDeleteView):
    pass