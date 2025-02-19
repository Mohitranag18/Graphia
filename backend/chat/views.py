from django.shortcuts import get_object_or_404
from django.http import JsonResponse, Http404
from rest_framework.response import Response
from rest_framework import status
from .models import ChatGroup, GroupMessage, PrivateChat, PrivateMessage
from .serializers import GroupMessageSerializer, PrivateMessageSerializer, ChatGroupSerializer, UserSerializer, PrivateChatSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from django.db import models

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_messages(request, slug):
    try:
        # Fetch the chat group
        chat_group = get_object_or_404(ChatGroup, slug=slug)
        
        # Get the last 30 messages (reverse order for latest)
        messages = chat_group.chat_messages.all().order_by('created')
        
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

@api_view(['POST'])
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
    search_query = request.GET.get('search', '')  # Get the search query from the request
    if search_query:
        # Filter groups based on the search query
        groups = ChatGroup.objects.filter(
            Q(group_name__icontains=search_query) |
            Q(description__icontains=search_query)
        ).values('id', 'group_name', 'slug', 'description', 'created_at')
    else:
        # Return all groups by default
        groups = ChatGroup.objects.values('id', 'group_name', 'slug', 'description', 'created_at')
    
    return JsonResponse(list(groups), safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_group_details(request, slug):
    group = get_object_or_404(ChatGroup, slug=slug)
    serializer = ChatGroupSerializer(group)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recent_private_chats(request):
    user = request.user
    search_query = request.query_params.get('q', '')  # Get the search query from request parameters

    # Base query to get all recent chats involving the user
    recent_chats = PrivateChat.objects.filter(
        Q(user1=user) | Q(user2=user)
    ).order_by('-last_message_at')

    # Filter by search query if provided
    if search_query:
        recent_chats = recent_chats.filter(
            Q(user1__username__icontains=search_query) |
            Q(user2__username__icontains=search_query)
        )

    # Serialize and return the data
    serializer = PrivateChatSerializer(recent_chats, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_files_message(request, slug):
    """
    Create a new message for a specific group. Supports both text messages and file uploads.
    """
    group = get_object_or_404(ChatGroup, slug=slug)

    # Attach the authenticated user as the author
    data = request.data.copy()
    data['author'] = request.user.username
    data['group'] = group.slug

    # Serialize and validate the data
    serializer = GroupMessageSerializer(data=data)
    if serializer.is_valid():
        # Save the message (text or file) to the database
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Only authenticated users can send messages
def create_private_files_message(request, group_name):
    """
    Create a new private message in an existing chat.
    """
    user = request.user  # Get the authenticated user
    chat = get_object_or_404(PrivateChat, group_name=group_name)  # Fetch the chat

    # Check if the authenticated user is part of the chat
    if user not in [chat.user1, chat.user2]:
        return Response({'error': 'You are not a participant in this chat.'}, status=status.HTTP_403_FORBIDDEN)

    # Extract message data from the request
    data = request.data.copy()
    data['chat'] = chat.group_name  
    data['sender'] = user.username  

    serializer = PrivateMessageSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
