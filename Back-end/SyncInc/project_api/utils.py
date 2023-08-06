from rest_framework_simplejwt.tokens import AccessToken

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
