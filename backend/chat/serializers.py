from rest_framework import serializers
from .models import GroupMessage

class GroupMessageSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username')

    class Meta:
        model = GroupMessage
        fields = ['body', 'author', 'created']
