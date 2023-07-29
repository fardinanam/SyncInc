from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializer import *
from django.contrib.auth import authenticate
from .utils import send_email_token
# import status
from rest_framework import status
from django.contrib.auth.hashers import make_password

class LoginView(APIView):
    def post(self, request):
        try:
            # process the user data
            data = request.data
            serializer = LoginSerializer(data=data)

            if serializer.is_valid():
                # authenticate user
                email = serializer.data['email']
                password = make_password(serializer.data['password'], salt=email)
                user = User.objects.filter(email=email, password=password).first()

                if user is None:
                    return Response({
                        'status': 400,
                        'message': 'Invalid email or password',
                        'data': serializer.errors
                    }, status=status.HTTP_400_BAD_REQUEST)

                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status.HTTP_200_OK)

            return Response({
                'status': 400,
                'message': 'Something went wrong',
                'data': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(e)
            return Response({
                'status': 400,
                'message': str(e),
                'data': {}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class RegisterView(APIView):
    def post(self, request):
        try:
            # process the user data
            data = request.data
            serializer = RegisterUserSerializer(data=data)

            if serializer.is_valid():
                email = data['email']
                # create user
                user = serializer.save()
                # send email verification token
                token = user.email_token
                send_email_token(email, token)
                # return response
                return Response({
                    'status': 200,
                    'message': 'User created successfully',
                    'data': serializer.data
                }, status=status.HTTP_200_OK)

            return Response({
                'status': 400,
                'message': 'Something went wrong',
                'data': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(e)
            return Response({
                'status': 400,
                'message': str(e),
                'data': {}
            }, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    def get(self, request, email_token):
        try:
            # get user with the token
            user = User.objects.get(email_token=email_token)

            if user is None:
                return Response({
                    'status': 400,
                    'message': 'Invalid token',
                    'data': {}
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # update user
            user.is_email_verified = True
            user.save()
            # return response
            return Response({
                'status': 200,
                'message': 'Email verified successfully',
                'data': {}
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({
                'status': 400,
                'message': str(e),
                'data': {}
            }, status=status.HTTP_400_BAD_REQUEST)
