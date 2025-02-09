from rest_framework import serializers
from .models import GroupMessage, PrivateMessage, ChatGroup, PrivateChat
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
    formatted_date = serializers.SerializerMethodField()

    class Meta:
        model = ChatGroup
        fields = ['id', 'group_name', 'description', 'slug', 'created_at', 'users_online', 'formatted_date']
    
    def get_formatted_date(self, obj):
        return obj.created_at.strftime("%d %b %y")

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['id', 'username']

class PrivateChatSerializer(serializers.ModelSerializer):
    last_message_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    users = serializers.SerializerMethodField()

    class Meta:
        model = PrivateChat
        fields = ['id', 'group_name', 'last_message_at', 'users']

    def get_users(self, obj):
        request = self.context.get('request')
        other_user = obj.user1 if obj.user2 == request.user else obj.user2
        return {'id': other_user.username, 'username': other_user.username}