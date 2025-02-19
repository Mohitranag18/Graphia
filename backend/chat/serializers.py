from rest_framework import serializers
from .models import GroupMessage, PrivateMessage, ChatGroup, PrivateChat
from base.models import MyUser

class GroupMessageSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username')
    group = serializers.SlugRelatedField(slug_field='slug', queryset=ChatGroup.objects.all())

    class Meta:
        model = GroupMessage
        fields = ['id', 'group', 'author', 'body', 'file', 'created']
        read_only_fields = ['id', 'author', 'created']
    
    def create(self, validated_data):
        author_data = validated_data.pop('author')  # Extract the author data
        author = MyUser.objects.get(username=author_data['username'])  # Get MyUser instance
        group_message = GroupMessage.objects.create(author=author, **validated_data)  # Save with correct author
        return group_message

class PrivateMessageSerializer(serializers.ModelSerializer):
    chat = serializers.SlugRelatedField(
        queryset=PrivateChat.objects.all(),
        slug_field='group_name'  # Use group_name instead of ID
    )

    class Meta:
        model = PrivateMessage
        fields = ['chat', 'sender', 'body', 'file', 'created']

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