from django.shortcuts import get_object_or_404
from django.http import JsonResponse, Http404
from rest_framework.response import Response
from rest_framework import status
from .models import ChatGroup, GroupMessage, PrivateChat, PrivateMessage
from .serializers import GroupMessageSerializer, PrivateMessageSerializer, ChatGroupSerializer, UserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

@api_view(['GET'])
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def create_group(request):
    serializer = ChatGroupSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def join_group(request, group_id):
    try:
        group = ChatGroup.objects.get(id=group_id)
    except ChatGroup.DoesNotExist:
        return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

    # Add the user to the group
    group.users_online.add(request.user)
    return Response({"message": f"{request.user.username} joined {group.group_name}"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def leave_group(request, group_id):
    try:
        group = ChatGroup.objects.get(id=group_id)
    except ChatGroup.DoesNotExist:
        return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

    # Remove the user from the group
    group.users_online.remove(request.user)
    return Response({"message": f"{request.user.username} left {group.group_name}"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_groups(request):
    groups = ChatGroup.objects.values('id', 'group_name', 'description', 'created_at')
    return JsonResponse(list(groups), safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_group_details(request, group_id):
    group = get_object_or_404(ChatGroup, pk=group_id)
    serializer = ChatGroupSerializer(group)
    return Response(serializer.data)