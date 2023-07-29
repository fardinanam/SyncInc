from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from . import serializer
from django.contrib.auth import authenticate


class LoginView(APIView):
    def post(self, request):
        try:
            # process the user data
            data = request.data
            serializer = serializer.LoginSerializer(data=data)

            if serializer.is_valid():
                email = serializer.data['email']
                password = serializer.data['password']

                user = authenticate(email=email, password=password)

                if user is None:
                    return Response({
                        'status': 400,
                        'message': 'Invalid email or password',
                        'data': serializer.errors
                    })

                refresh = RefreshToken.for_user(user)
                return {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }

            return Response({
                'status': 400,
                'message': 'Something went wrong',
                'data': serializer.errors
            })

        except Exception as e:
            print(e)
            return Response({
                'status': 400,
                'message': str(e),
                'data': {}
            })
