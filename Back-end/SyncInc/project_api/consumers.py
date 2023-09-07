import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer

from .utils import *
class SocketAppsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        username = self.scope["url_route"]["kwargs"]["username"]
        self.room_name = username
        self.room_group_name = f"ws_{self.room_name}"

        await self.channel_layer.group_add(
            self.room_group_name, self.channel_name
        )

        await self.accept()
        # await self.send(text_data=json.dumps({
        #     "type": "Connection established from project api",
        #     "message": "Connected to server"
        # }))

    async def disconnect(self, close_code):
        # Leave room group
        print("Disconnected")
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
    
    async def notification_message(self, event):
        message = event['message']
        print(message,'consumers 30')
        await self.send(text_data=json.dumps({
            'msg_type':'notification',
            'message':message
        }))
        print(message,'consumers 35')
    # # Receive message from WebSocket
    # async def receive(self, text_data):
    #     text_data_json = json.loads(text_data)
    #     message = text_data_json["message"]

    #     # Send message to room group
    #     await self.channel_layer.group_send(
    #         self.room_group_name, {"type": "chat.message", "message": message}
    #     )

    # # Receive message from room group
    # async def chat_message(self, event):
    #     message = event["message"]

    #     # Send message to WebSocket
    #     await self.send(text_data=json.dumps({"message": message}))