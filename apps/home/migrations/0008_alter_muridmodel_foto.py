# Generated by Django 3.2.7 on 2021-09-17 06:15

import apps.home.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0007_alter_muridmodel_kelahiran'),
    ]

    operations = [
        migrations.AlterField(
            model_name='muridmodel',
            name='foto',
            field=models.FileField(blank=True, null=True, upload_to='static/data/%Y/%m/%d', validators=[apps.home.validators.validate_file_extension]),
        ),
    ]
