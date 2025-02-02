from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import ChatGroup, GroupMessage
from .serializers import GroupMessageSerializer

@api_view(['GET'])
def fetch_messages(request, group_name):
    try:
        # Fetch the chat group
        chat_group = get_object_or_404(ChatGroup, group_name=group_name)
        
        # Get the last 30 messages
        messages = chat_group.chat_messages.all().order_by('created')[:300]
        
        # Serialize the messages
        serializer = GroupMessageSerializer(messages, many=True)
        
        return Response(serializer.data)
    
    except ChatGroup.DoesNotExist:
        return Response({'error': 'Chat group not found'}, status=status.HTTP_404_NOT_FOUND)

