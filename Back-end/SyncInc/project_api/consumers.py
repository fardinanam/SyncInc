import json
from .models import Notification
from asgiref.sync import async_to_sync, sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from datetime import datetime 

from .utils import *
from .views import update_notification_status

class SocketAppsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        username = self.scope["url_route"]["kwargs"]["username"]
        self.room_name = username
        self.room_group_name = f"ws_{self.room_name}"

        await self.channel_layer.group_add(
            self.room_group_name, self.channel_name
        )

        await self.accept()
        # await send_unsent_notifications(username)

    async def disconnect(self, close_code):
        # Leave room group
        print("Disconnected")
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
    
    async def notification_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'msg_type':'notification',
            'message':message
        }))
        print(message,'consumers 35')

    # Receive message from WebSocket
    async def receive(self, text_data):
        message = json.loads(text_data)
        notification_status = message['status']
        notification_id = message['id']
        print("received",message)
        await update_notification_status(notification_status, notification_id)


# class SocketAppsConsumer(WebsocketConsumer):
#     def connect(self):
#         username = self.scope["url_route"]["kwargs"]["username"]
#         self.room_name = username
#         self.room_group_name = f"ws_{self.room_name}"

#         self.channel_layer.group_add(
#             self.room_group_name, self.channel_name
#         )

#         self.accept()
#         # await self.send(text_data=json.dumps({
#         #     "type": "Connection established from project api",
#         #     "message": "Connected to server"
#         # }))

#     def disconnect(self, close_code):
#         # Leave room group
#         print("Disconnected")
#         self.channel_layer.group_discard(self.room_group_name, self.channel_name)
    
#     def notification_message(self, event):
#         message = event['message']
#         print(message,'consumers 30')
#         self.send(text_data=json.dumps({
#             'msg_type':'notification',
#             'message':message
#         }))
#         # notification = sync_to_async(Notification.objects.get(id=message['id']))
#         # notification.sent = True
#         print(message,'consumers 35')