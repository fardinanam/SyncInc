from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import User
import uuid


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
        validated_data['password'] = make_password(validated_data['password'], salt=validated_data['email'])
        validated_data['email_token'] = str(uuid.uuid4())

        return super().create(validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=254)
    password = serializers.CharField(max_length=254)
