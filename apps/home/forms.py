from django import forms

from . import models

class MuridForm(forms.ModelForm):
  class Meta:
    model = models.MuridModel
    fields = [
      'nama',
      'ayah',
      'ibu',
      'foto',
      'alamat',
      'kelahiran'
      ]