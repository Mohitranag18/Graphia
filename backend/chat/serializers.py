from rest_framework import serializers
from .models import GroupMessage, PrivateMessage

class GroupMessageSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username')

    class Meta:
        model = GroupMessage
        fields = ['body', 'author', 'created']

class PrivateMessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = PrivateMessage
        fields = ['body', 'sender', 'created']
