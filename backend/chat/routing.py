
from django.urls import path
from .consumers import ChatroomConsumer, PrivateChatConsumer

websocket_urlpatterns = [
    path('ws/chatroom/<str:chatroom_name>/', ChatroomConsumer.as_asgi()),
    path('ws/private/<str:other_username>/', PrivateChatConsumer.as_asgi()),
]
