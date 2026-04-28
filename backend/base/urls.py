from django.urls import path
from .views import get_notes, CustomTokenObtainPairView, CustomRefreshTokenView, logout, is_authenticated, register, send_otp, toggleFollow, get_user_profile_data, get_users_posts, toggleLike, create_post, get_posts, get_post_byId, search_user, update_user_details, change_password, request_password_reset, reset_password, get_comments, create_comment, delete_comment, get_followers_list, get_following_list, get_notifications, mark_notifications_read, get_unread_count

from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomRefreshTokenView.as_view(), name='token_refresh'),
    path('notes/', get_notes, name='get_notes'),  # GET method for fetching notes
    path('logout/', logout, name='logout'),  # POST method for logging out
    path('authenticated/', is_authenticated, name='is_authenticated'),  # POST method to check if authenticated
    path('register/', register, name='register'),  # POST method for registration,
    path('send_otp/', send_otp, name='send_otp'),
    path('changePassword/', change_password, name='change_password'),
    path('requestPasswordReset/', request_password_reset, name='request_password_reset'),
    path('resetPassword/<str:username>/<str:token>/', reset_password, name='reset_password'),
    path('user_data/<str:pk>/', get_user_profile_data, name='get_user_profile_data'),  # GET method for fetching user data
    path('toggle_follow/', toggleFollow),
    path('posts/<str:pk>/', get_users_posts),
    path('toggleLike/', toggleLike),
    path('create_post/', create_post),
    path('get_posts/', get_posts),
    path('get_posts_byId/<post_id>/', get_post_byId),
    path('search/', search_user),
    path('update_user/', update_user_details),
    path('get_comment/<post_id>/', get_comments),
    path('create_comment/<post_id>', create_comment),
    path('delete_comment/<comment_id>', delete_comment),
    path('followers/<str:username>/', get_followers_list, name='get_followers_list'),
    path('following/<str:username>/', get_following_list, name='get_following_list'),
    path('notifications/', get_notifications, name='get_notifications'),
    path('notifications/read/', mark_notifications_read, name='mark_notifications_read'),
    path('notifications/unread_count/', get_unread_count, name='get_unread_count'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
