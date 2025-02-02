from django.urls import path
from . import views

urlpatterns = [
    # Fetch messages for a specific chat group
    path('api/chatrooms/<str:group_name>/messages/', views.fetch_messages, name='fetch_messages'),
]
