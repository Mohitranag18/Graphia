from django.contrib import admin
from .models import Note, Post, Comment
from django.contrib.auth import get_user_model

# Use get_user_model() instead of settings.AUTH_USER_MODEL
User = get_user_model()
admin.site.register(User)
admin.site.register(Post)
admin.site.register(Comment)


