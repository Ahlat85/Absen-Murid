# Generated by Django 3.2.7 on 2021-09-16 11:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0004_alter_muridmodel_kelahiran'),
    ]

    operations = [
        migrations.AlterField(
            model_name='muridmodel',
            name='kelahiran',
            field=models.DateField(default=None),
        ),
    ]
