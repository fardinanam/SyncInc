def get_token_from_request(request):
    # Get the token from the Authorization header
    auth_header = request.META.get('HTTP_AUTHORIZATION')
    if auth_header and auth_header.startswith('Bearer '):
        return auth_header.split(' ')[1]

    return None
