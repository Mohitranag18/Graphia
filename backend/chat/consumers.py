import json
from channels.generic.websocket import WebsocketConsumer
from django.shortcuts import get_object_or_404
from asgiref.sync import async_to_sync
import jwt  # You need to install pyjwt library
from django.contrib.auth import get_user_model
from django.conf import settings
from .models import ChatGroup, GroupMessage, PrivateMessage, PrivateChat

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
        self.chatroom = get_object_or_404(ChatGroup, slug=self.chatroom_name)

        # Add user to the group channel layer
        async_to_sync(self.channel_layer.group_add)(
            self.chatroom_name, self.channel_name
        )



        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.chatroom_name, self.channel_name
        )


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

    def file_handler(self, event):
        self.send(text_data=json.dumps({
            'message': event['message'],
            'file': event['file'],
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

class PrivateChatConsumer(WebsocketConsumer):

    def connect(self):
        # Extract the cookie from the handshake
        cookie = self.scope.get('cookies', {}).get('access_token', None)
        print(f"Received token: {cookie}")


        # Authenticate the user using the cookie (JWT)
        if not cookie or not self.authenticate_user(cookie):
            print("Authentication failed.")
            self.close()  # Close connection if authentication fails
        
        self.user = self.scope['user']
        self.other_user_username = self.scope["url_route"]["kwargs"]["other_username"]
        self.other_user = get_object_or_404(User, username=self.other_user_username)

        self.chat_room = f"private_{min(self.user.username, self.other_user.username)}_{max(self.user.username, self.other_user.username)}"

        async_to_sync(self.channel_layer.group_add)(
            self.chat_room,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.chat_room,
            self.channel_name
        )


    def receive(self, text_data):
        print("Received message:", text_data)  # Debugging line
        try:
            text_data_json = json.loads(text_data)
            body = text_data_json.get("body")

            # Save the private message
            private_chat, _ = PrivateChat.objects.get_or_create(
                user1=min(self.user, self.other_user, key=lambda u: u.username),
                user2=max(self.user, self.other_user, key=lambda u: u.username)
            )

            message = PrivateMessage.objects.create(
                chat=private_chat,
                sender=self.user,
                body=body
            )

            # Broadcast the message
            async_to_sync(self.channel_layer.group_send)(
                self.chat_room, {
                    "type": "message_handler",
                    "message": message.body,
                    "author": message.sender.username,
                    "timestamp": message.created.strftime("%Y-%m-%d %H:%M:%S")
                }
            )
                        
            print(f"Message created: {message}")  # Debugging line

        except Exception as e:
            print(f"Error in processing WebSocket message: {e}")

    def message_handler(self, event):
        self.send(text_data=json.dumps({
            "message": event["message"],
            "author": event["author"],
            "timestamp": event["timestamp"]
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
    
