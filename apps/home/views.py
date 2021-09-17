from django.shortcuts import render
from django.views.generic import ListView, FormView

from .models import *

import website

class MuridListView(ListView):
  model = MuridModel
  template_name = 'home/murid_list.html'
  paginate_by = 9
  extra_context = {
    'title_page': 'List'
  }

def index(request):
  context = {
    'title_page': 'Index',
    'app_version': website.__version__
  }
  return render(request, 'home/index.html', context)
 
def about(request):
  return render(request, 'home/index.html')
  