from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class MyUser(AbstractUser):
    username = models.CharField(max_length=50, unique=True, primary_key=True)
    bio = models.CharField(max_length=500, blank=True, null=True)
    profile_image = models.URLField(blank=True, null=True)
    follower = models.ManyToManyField('self', symmetrical=False, related_name='following', blank=True)

    def follower_count(self):
        # Calculate and return the follower count, for example:
        return self.follower.count() 

    def following_count(self):
        # Calculate and return the following count, for example:
        return self.following.count()

    def __str__(self):
        return self.username
    
class Post(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='posts')
    description = models.CharField(max_length=400)
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(MyUser, related_name='post_likes', blank=True)
    post_image_url = models.URLField(blank=True, null=True)

class Comment(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} commented on {self.post.id}'

class Note(models.Model):
    description = models.CharField(max_length=300)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='note')

