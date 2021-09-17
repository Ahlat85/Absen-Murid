from django.db import models

from . import validators

class MuridModel(models.Model):
  nama = models.CharField(max_length=50, blank=False)
  ayah = models.CharField(max_length=50, blank=False)
  ibu = models.CharField(max_length=50, blank=True)
  foto = models.FileField(upload_to='static/data/%Y/%m/%d', validators=[validators.validate_file_extension], null=True, blank=True)
  alamat = models.TextField(blank=True)
  kelahiran = models.DateField(blank=True, null=True)
  
  def __str__(self):
    return f'{self.nama} : {self.ayah}'