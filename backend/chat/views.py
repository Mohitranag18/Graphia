from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import ChatGroup, GroupMessage, PrivateChat, PrivateMessage
from .serializers import GroupMessageSerializer, PrivateMessageSerializer

@api_view(['GET'])
def fetch_messages(request, group_name):
    try:
        # Fetch the chat group
        chat_group = get_object_or_404(ChatGroup, group_name=group_name)
        
        # Get the last 30 messages (reverse order for latest)
        messages = chat_group.chat_messages.all().order_by('created')[:30]
        
        # Serialize the messages
        serializer = GroupMessageSerializer(messages, many=True)
        
        return Response(serializer.data)
    
    except ChatGroup.DoesNotExist:
        return Response({'error': 'Chat group not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def fetch_private_messages(request, group_name):
    try:
        # Debugging: Check if group_name is being passed correctly
        print(f"Fetching messages for group: {group_name}")

        # Fetch the private chat group
        private_chat = get_object_or_404(PrivateChat, group_name=group_name)
        
        # Debugging: Check if the private_chat object is fetched
        print(f"Private chat: {private_chat}")

        # Get the last 30 private messages (reverse order for latest)
        messages = private_chat.private_messages.all().order_by('created')[:30]
        
        # Debugging: Print messages fetched
        print(f"Messages: {messages}")

        # Serialize the messages
        serializer = PrivateMessageSerializer(messages, many=True)
        
        return Response(serializer.data)
    
    except PrivateChat.DoesNotExist:
        return Response({'error': 'Private chat not found'}, status=status.HTTP_404_NOT_FOUND)

