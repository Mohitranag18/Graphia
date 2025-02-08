from rest_framework import serializers
from .models import GroupMessage, PrivateMessage, ChatGroup
from base.models import MyUser

class GroupMessageSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username')

    class Meta:
        model = GroupMessage
        fields = ['body', 'author', 'created']

class PrivateMessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = PrivateMessage
        fields = ['body', 'sender', 'created']

class ChatGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatGroup
        fields = ['id', 'group_name', 'description', 'slug', 'created_at', 'users_online']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['id', 'username']