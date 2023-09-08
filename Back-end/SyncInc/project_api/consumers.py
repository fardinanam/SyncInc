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
        notifications_data = json.loads(text_data)
        # print("received", notifications_data)
        await update_notification_status(notifications_data)
