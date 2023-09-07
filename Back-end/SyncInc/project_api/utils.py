from rest_framework_simplejwt.tokens import AccessToken
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def get_token_from_request(request):
    # Get the token from the Authorization header
    auth_header = request.META.get('HTTP_AUTHORIZATION')
    if auth_header and auth_header.startswith('Bearer '):
        return auth_header.split(' ')[1]

    return None

def get_data_from_token(request, key):
    token = get_token_from_request(request)
    access_token_obj = AccessToken(token)
    return access_token_obj[key]

def send_notification_to_user(username, message):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'ws_{username}', {
            "type": "notification_message",
            "message": message
        }
    )