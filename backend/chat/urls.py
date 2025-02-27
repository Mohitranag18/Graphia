from django.urls import path
from .views import *

urlpatterns = [
    # Fetch messages for a specific chat group
    path('api/chatrooms/<str:slug>/messages/', fetch_messages, name='fetch_messages'),
    path('api/chatrooms/<str:group_name>/private_messages/', fetch_private_messages, name='fetch_private_messages'),
    path('api/groups/', create_group, name='create_group'),
    path('api/groups/<int:group_id>/join/', join_group, name='join_group'),
    path('api/groups/<int:group_id>/leave/', leave_group, name='leave_group'),
    path('api/groups_list/', get_all_groups, name='get_all_groups'),
    path('api/groups_details/<str:slug>/', get_group_details, name='get_group_details'),
    path('api/recent_private_chats/', get_recent_private_chats, name='get_recent_private_chats'),
    path('api/group/<str:slug>/messages/', create_files_message, name='group-message-create'),
    path('api/group/<str:group_name>/private_messages/', create_private_files_message, name='private-message-create'),
]
