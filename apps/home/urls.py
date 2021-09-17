from django.urls import path

from django.views.generic.base import RedirectView

from .views import *

urlpatterns = [
    path('', index),
    path('list', MuridListView.as_view()),
    path('list/<int:page>', MuridListView.as_view()),
    path('create', RedirectView.as_view(url='/admin/home/muridmodel/add')),
    path('about', about),
]
