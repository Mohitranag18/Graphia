import json
import jwt
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()


class NotificationConsumer(WebsocketConsumer):
    """
    WebSocket consumer for real-time notifications.
    Each authenticated user joins their own notification group.
    """

    def connect(self):
        cookie = self.scope.get('cookies', {}).get('access_token', None)
        if not cookie or not self.authenticate_user(cookie):
            self.close()
            return

        self.user = self.scope['user']
        self.group_name = f"notifications_{self.user.username}"

        async_to_sync(self.channel_layer.group_add)(
            self.group_name, self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            async_to_sync(self.channel_layer.group_discard)(
                self.group_name, self.channel_name
            )

    def send_notification(self, event):
        """Receive notification from channel layer and forward to WebSocket client."""
        self.send(text_data=json.dumps(event['notification']))

    def authenticate_user(self, cookie):
        try:
            token = cookie.strip()
            decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user = User.objects.get(username=decoded['username'])
            self.scope['user'] = user
            return True
        except jwt.ExpiredSignatureError:
            print("JWT token expired")
        except jwt.InvalidTokenError:
            print("JWT token is invalid")
        except Exception as e:
            print(f"Unexpected error: {e}")
        return False
