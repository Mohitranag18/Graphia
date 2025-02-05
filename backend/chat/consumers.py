import json
from channels.generic.websocket import WebsocketConsumer
from django.shortcuts import get_object_or_404
from asgiref.sync import async_to_sync
import jwt  # You need to install pyjwt library
from django.contrib.auth import get_user_model
from django.conf import settings
from .models import ChatGroup, GroupMessage

User = get_user_model()

class ChatroomConsumer(WebsocketConsumer):

    def connect(self):
        # Extract the cookie from the handshake
        cookie = self.scope.get('cookies', {}).get('access_token', None)
        print(f"Received token: {cookie}")


        # Authenticate the user using the cookie (JWT)
        if not cookie or not self.authenticate_user(cookie):
            print("Authentication failed.")
            self.close()  # Close connection if authentication fails
        
        self.user = self.scope['user']
        self.chatroom_name = self.scope['url_route']['kwargs']['chatroom_name']
        self.chatroom = get_object_or_404(ChatGroup, group_name=self.chatroom_name)

        async_to_sync(self.channel_layer.group_add)(
            self.chatroom_name, self.channel_name
        )
        #add and update online users
        if self.user not in self.chatroom.users_online.all():
            self.chatroom.users_online.add(self.user)
            self.update_online_count()

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.chatroom_name, self.channel_name
        )

        # remove and update online users
        if self.user in self.chatroom.users_online.all():
            self.chatroom.users_online.remove(self.user)
            self.update_online_count()


    def receive(self, text_data):
        print("Received message:", text_data)  # Debugging line
        try:
            text_data_json = json.loads(text_data)
            body = text_data_json['body']

            message = GroupMessage.objects.create(
                body=body,
                author=self.user,
                group=self.chatroom
            )

            print(f"Message created: {message}")  # Debugging line

            event = {
                'type': 'message_handler',
                'message': message.body,
                'author': message.author.username,
                'timestamp': message.created.strftime('%Y-%m-%d %H:%M:%S')
            }

            # Send the event to the group (chatroom)
            async_to_sync(self.channel_layer.group_send)(
                self.chatroom_name, event
            )
        except Exception as e:
            print(f"Error in processing WebSocket message: {e}")

    def message_handler(self, event):
        self.send(text_data=json.dumps({
            'message': event['message'],
            'author': event['author'],
            'timestamp': event['timestamp']
        }))

    def authenticate_user(self, cookie):
        try:
            if not cookie:
                print("Token not found in cookie")
                return False

            token = cookie.strip()  # Assume the cookie contains only the token

            decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            print(f"Decoded JWT: {decoded}")

            # Validate the user ID from the token
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
    
    def update_online_count(self):
        online_count = self.chatroom.users_online.count()

        event = {
            'type': 'online_count_handler',
            'online_count': online_count
        }
        async_to_sync(self.channel_layer.group_send)(self.chatroom_name, event)

    def online_count_handler(self, event):
        online_count = event['online_count']
        
        # Send online count as JSON instead of HTML
        self.send(text_data=json.dumps({
            'type': 'online_users_count',
            'count': online_count
        }))
