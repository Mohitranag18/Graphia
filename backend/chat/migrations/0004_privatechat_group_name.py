# Generated by Django 5.1.5 on 2025-02-06 11:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_privatechat_privatemessage'),
    ]

    operations = [
        migrations.AddField(
            model_name='privatechat',
            name='group_name',
            field=models.CharField(blank=True, max_length=128, unique=True),
        ),
    ]
