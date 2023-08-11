from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import *
import uuid

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name

        return token

class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'phone', 'birth_date', 'address', 'email_token', 'is_email_verified']

        extra_kwargs = {
            'password': {'write_only': True},
            'email_token': {'write_only': True},
            'is_email_verified': {'read_only': True},    
        }

    def create(self, validated_data):
        '''
        hashes the password and
        generates email token before saving
        '''
        # validated_data['password'] = make_password(validated_data['password'], salt=validated_data['email'])
        validated_data['email_token'] = str(uuid.uuid4())
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=254)
    password = serializers.CharField(max_length=254)

class ProfileInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'phone', 'birth_date', 'address', 'profile_picture', 'tags']
        depth = 1

        extra_kwargs = {
            'email_token': {'write_only': True},
            'is_email_verified': {'read_only': True},    
        }

class ProfilePicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['profile_picture']
    
    # profile_picture = serializers.ImageField(max_length=None, use_url=False)

class PersonalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone', 'birth_date']

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
