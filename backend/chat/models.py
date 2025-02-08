from django.db import models
from django.conf import settings
from django.utils.text import slugify

class ChatGroup(models.Model):
    group_name = models.CharField(max_length=128, unique=True)
    description = models.TextField(blank=True, null=True)
    slug = models.SlugField(max_length=150, unique=True, blank=True)
    users_online = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='online_in_group', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.group_name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.group_name)
        super(ChatGroup, self).save(*args, **kwargs)
    
class GroupMessage(models.Model):
    group = models.ForeignKey(ChatGroup, related_name='chat_messages', on_delete=models.CASCADE)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    body = models.CharField(max_length=300)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.author.username} : {self.body}'
    
    class Meta:
        ordering = ['-created']


class PrivateChat(models.Model):
    user1 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_user1')
    user2 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_user2')
    group_name = models.CharField(max_length=128, unique=True, blank=True)  # Keep the field blank initially
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Set group_name dynamically based on user1 and user2 usernames
        if not self.group_name:  # Set it only if group_name is not provided
            self.group_name = f"{self.user1.username}_{self.user2.username}"

        super(PrivateChat, self).save(*args, **kwargs)  # Call the original save method

    def __str__(self):
        return self.group_name  # Return group_name as the string representation


class PrivateMessage(models.Model):
    chat = models.ForeignKey(PrivateChat, related_name='private_messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    body = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username}: {self.body}"

    class Meta:
        ordering = ['-created']
