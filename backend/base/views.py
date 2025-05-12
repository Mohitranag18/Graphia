from django.shortcuts import render
from rest_framework import status
from .models import MyUser
from .models import Note, Post, Comment
from .serializer import NoteSerializer, UserRegistrationSerializer, MyUserProfileSerializer, PostSerializer, UserSerializer, CommentSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from .models import Post
from .utils.supabase_client import supabase
import uuid
from uuid import uuid4

# Import the custom user model
MyUser = get_user_model()

from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens['access']
            refresh_token = tokens['refresh']
            username = request.data['username']

            try:
                user = MyUser.objects.get(username=username)
            except MyUser.DoesNotExist:
                return Response({'error':'user does not exist'})

            res = Response()

            res.data = {'success':True,
                        'user': {
                            "username":user.username,
                            "bio":user.bio,
                            "email":user.email,
                            "first_name":user.first_name,
                            "last_name":user.last_name
                            }
                        }

            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/',
                # partitioned=True
            )

            res.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/',
                # partitioned=True
            )

            return res

        except:
            return Response({'success':False})

class CustomRefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')

            request.data['refresh'] = refresh_token
            response = super().post(request, *args, **kwargs)

            tokens = response.data
            access_token = tokens['access']

            res = Response()

            res.data = {'refreshed':True}
            
            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/',
                # partitioned=True
            )
            
            return res
        except:
            return Response()
        
@api_view(['POST'])
def logout(request):
    try:
        res = Response()
        res.data = {'success':True}
        res.delete_cookie('access_token', path='/', samesite='None')
        res.delete_cookie('refresh_token', path='/', samesite='None')
        return res
    except:
        return Response({'success':False})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    return Response({'authenticated':True})


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user  # Get the authenticated user
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    if not old_password or not new_password:
        return Response({"error": "Old and new passwords are required"}, status=400)

    if not user.check_password(old_password):  # Validate old password
        return Response({"error": "Old password is incorrect"}, status=400)

    user.set_password(new_password)  # Change password securely
    user.save()

    return Response({"success": "Password changed successfully"}, status=200)

@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    email = request.data.get("email")
    if not email:
        return Response({"error": "Email is required"}, status=400)

    try:
        user = MyUser.objects.get(email=email)
    except MyUser.DoesNotExist:
        return Response({"error": "User with this email does not exist"}, status=400)

    # Generate a password reset token
    token = default_token_generator.make_token(user)
    
    # Normally, you'd generate a reset link with frontend URL
    reset_link = f"http://localhost:5173/resetPassword/{user.username}/{token}"

    # Send email with reset link
    send_mail(
        "Password Reset Request",
        f"Click the link to reset your password: {reset_link}",
        "mohitr8998@gmail.com",
        [email],
        fail_silently=False,
    )

    return Response({"success": "Password reset link sent to email"}, status=200)

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request, username, token):
    new_password = request.data.get("new_password")
    
    if not new_password:
        return Response({"error": "New password is required"}, status=400)

    try:
        user = MyUser.objects.get(username=username)
    except MyUser.DoesNotExist:
        return Response({"error": "Invalid user"}, status=400)

    # Validate token
    if not default_token_generator.check_token(user, token):
        return Response({"error": "Invalid or expired token"}, status=400)

    # Update password
    user.set_password(new_password)
    user.save()

    return Response({"success": "Password reset successful"}, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notes(request):
    user = request.user
    notes = Note.objects.filter(owner=user)
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile_data(request, pk):
    try:
        user = MyUser.objects.get(username=pk)
    except MyUser.DoesNotExist:
        return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = MyUserProfileSerializer(user, many=False)

    following = False

    if request.user in user.follower.all():
        following = True
    
    try:
        serializer = MyUserProfileSerializer(user, many=False)
        return Response({**serializer.data, 'is_our_profile': request.user.username == user.username, 'following':following}, status=status.HTTP_200_OK)
    except Exception as e:
        # Optionally, log the error for debugging purposes
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggleFollow(request):
    try:
        try:
            my_user = MyUser.objects.get(username=request.user.username)
            user_to_follow = MyUser.objects.get(username=request.data['username'])
        except:
            return Response({'error':'user does not exist'})
        if my_user in user_to_follow.follower.all():
            user_to_follow.follower.remove(my_user)
            return Response({'now_following':False})
        else:
            user_to_follow.follower.add(my_user)
            return Response({'now_following':True})
    except:
        return Response({'error':'error in following user'})
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users_posts(request, pk):
    try:
        user = MyUser.objects.get(username=pk)
        my_user = MyUser.objects.get(username=request.user.username)
    except MyUser.DoesNotExist:
        return Response({"error":"user does not exist"})
    
    posts = user.posts.all().order_by('-created_at')

    serializer = PostSerializer(posts, many=True)

    data = []

    for post in serializer.data:
        new_post = {}
        
        if my_user.username in post['likes']:
            new_post = {**post, 'liked':True}
        else:
            new_post = {**post, 'liked':False}
        data.append(new_post)

    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggleLike(request):
    try:
        try:
            post = Post.objects.get(id=request.data['id'])
        except Post.DoesNotExist:
            return Response({"error":"post does not exist"})
        
        try:
            user = MyUser.objects.get(username=request.user.username)
        except MyUser.DoesNotExist:
            return Response({"error":"user does not exist"})
        
        if user in post.likes.all():
            post.likes.remove(user)
            return Response({'now_liked':False})
        else:
            post.likes.add(user)
            return Response({'now_liked':True})
    except:
        return Response({"error":"faild to like post"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    try:
        user = request.user
        description = request.data.get("description")
        post_image = request.FILES.get("post_image")

        if not description:
            return Response({"error": "Description is required."}, status=400)

        image_url = None
        if post_image:
            ext = post_image.name.split('.')[-1]
            filename = f'{uuid4()}.{ext}'

            # Upload to Supabase
            file_bytes = post_image.read()
            upload_response = supabase.storage.from_('post-images').upload(
                filename, 
                file_bytes,
                {
                    "content-type": post_image.content_type
                }
            )

            if not upload_response or not hasattr(upload_response, "path"):
                return Response({"error": "Failed to upload image"}, status=500)

            # Get public URL
            image_url = supabase.storage.from_('post-images').get_public_url(upload_response.path)

        # Save post
        post = Post.objects.create(user=user, description=description, post_image_url=image_url)
        return Response({"success": True, "post_id": post.id})

    except Exception as e:
        print(str(e))
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_posts(request):
    try:
        my_user = MyUser.objects.get(username=request.user.username)
    except MyUser.DoesNotExist:
        return Response({'error':'user does not exist'})
    
    posts = Post.objects.all().order_by('-created_at')

    paginator = PageNumberPagination()
    paginator.page_size = 10

    result_page = paginator.paginate_queryset(posts, request)
    serializer = PostSerializer(result_page, many=True)

    data = []

    for post in serializer.data:
        new_post = {}
        
        if my_user.username in post['likes']:
            new_post = {**post, 'liked':True}
        else:
            new_post = {**post, 'liked':False}
        data.append(new_post)

    return paginator.get_paginated_response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_post_byId(request, post_id):
    try:
        my_user = MyUser.objects.get(username=request.user.username)
    except MyUser.DoesNotExist:
        return Response({'error':'user does not exist'})
    
    try:
        post = Post.objects.get(id=post_id)
        serializer = PostSerializer(post)
        post_data = serializer.data

        if my_user.username in post_data['likes']:
            post_data['liked'] = True
        else:
            post_data['liked'] = False

        return Response(post_data)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_user(request):
    query = request.query_params.get('query', '')
    users = MyUser.objects.filter(username__icontains=query)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

from uuid import uuid4
from rest_framework.parsers import MultiPartParser

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_details(request):
    try:
        user = MyUser.objects.get(username=request.user.username)
    except MyUser.DoesNotExist:
        return Response({'error': 'User does not exist'}, status=404)

    data = request.data.copy()  # Make it mutable
    profile_image_file = request.FILES.get('profile_image')

    if profile_image_file:
        ext = profile_image_file.name.split('.')[-1]
        filename = f'{uuid4()}.{ext}'

        profile_image_file.seek(0)
        upload_response = supabase.storage.from_('profile-images').upload(
            filename,
            profile_image_file.read(),
            {
                "content-type": profile_image_file.content_type
            }
        )

        if not upload_response or not hasattr(upload_response, "path"):
            return Response({"error": "Failed to upload profile image"}, status=500)

        image_url = supabase.storage.from_('profile-images').get_public_url(upload_response.path)
        data['profile_image'] = image_url

    serializer = MyUserProfileSerializer(user, data=data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({**serializer.data, "success": True})
    
    return Response({**serializer.errors, "success": False}, status=400)


@api_view(['GET'])
def get_comments(request, post_id):
    comments = Comment.objects.filter(post_id=post_id).order_by('-created_at')
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request, post_id):
    data = request.data
    data['user'] = request.user.username
    data['post'] = post_id
    serializer = CommentSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_comment(request, comment_id):
    try:
        comment = Comment.objects.get(id=comment_id, user=request.user)
        comment.delete()
        return Response({'message': 'Comment deleted successfully'}, status=204)
    except Comment.DoesNotExist:
        return Response({'error': 'Comment not found or not authorized'}, status=404)