from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from .serializer import *
from .utils import send_email_token
from project_api.utils import get_data_from_token

class LoginView(APIView):
    def post(self, request):
        try:
            # process the user data
            data = request.data
            serializer = LoginSerializer(data=data)

            if serializer.is_valid():
                # authenticate user
                email = serializer.data['email']
                password = serializer.data['password']
                user = authenticate(email=email, password=password)

                if user is None:
                    return Response({
                        'message': 'Invalid email or password',
                        'data': serializer.errors
                    }, status=status.HTTP_403_FORBIDDEN)
                
                if user.is_email_verified is False:
                    return Response({
                        'message': 'Email not verified',
                        'data': None
                    }, status=status.HTTP_403_FORBIDDEN)

                # refresh = RefreshToken.for_user(user)
                refresh = CustomTokenObtainPairSerializer.get_token(user)

                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                }, status.HTTP_200_OK)

            return Response({
                'message': 'Something went wrong',
                'data': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(e)
            return Response({
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
                    'message': 'User created successfully',
                    'data': serializer.data
                }, status=status.HTTP_200_OK)

            return Response({
                'message': 'Something went wrong',
                'data': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(e)
            return Response({
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
                    'message': 'Invalid token',
                    'data': {}
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # update user
            user.is_email_verified = True
            user.save()
            # return response
            return Response({
                'message': 'Email verified successfully',
                'data': {}
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({
                'message': str(e),
                'data': {}
            }, status=status.HTTP_400_BAD_REQUEST)

class ProfileInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_id = get_data_from_token(request, 'user_id')
            serializer = ProfileInfoSerializer(User.objects.get(id=user_id))
            return Response({
                'message': 'User profile info',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({
                'message': str(e),
                'data': {}
            }, status=status.HTTP_400_BAD_REQUEST)

class UpdateProfilePicView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser,)

    def put(self, request):
        try:
            user = get_data_from_token(request, 'user_id')
            print(request.FILES)
            user = User.objects.get(id=user)
            serializer = ProfilePicSerializer( instance=user, data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'Profile picture updated successfully',
                    'data': serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'message': 'Something went wrong',
                    'data': serializer.errors
                }, status=status.HTTP_403_FORBIDDEN) 
            
        except Exception as e:
            print(e)
            return Response({
                'message': str(e),
                'data': {}
            }, status=status.HTTP_400_BAD_REQUEST)
        
class UpdatePersonalInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        try:
            user_id = get_data_from_token(request, 'user_id')
            user = User.objects.get(id=user_id)
            serializer = PersonalInfoSerializer(instance=user, data=request.data)

            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response({
                'message': 'Personal info updated successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(e)
            return Response({
                'message': str(e),
                'data': {}
            }, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateUserAddressView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user_id = get_data_from_token(request, 'user_id')
        user = User.objects.get(id=user_id)
        serializer = AddressSerializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except Exception as e:
            print(e)
            return Response({
                'message': 'Something went wrong',
                'data': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if user.address:
            user.address.delete()
        
        user.address = serializer.instance
        user.save()

        return Response({
            'message': 'Address updated successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
