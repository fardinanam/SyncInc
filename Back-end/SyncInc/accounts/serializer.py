from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.conf import settings
from .models import *
import uuid
import pyrebase

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name

        try:
            token['profile_picture'] = user.profile_picture
        except Exception as e:
            print(e)           

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
    tags = serializers.StringRelatedField(many=True)
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'phone', 'birth_date', 'address', 'profile_picture', 'tags']
        depth = 1

        extra_kwargs = {
            'email_token': {'write_only': True},
            'is_email_verified': {'read_only': True},    
        }

    def get_tags(self, obj):
        return obj.tags.values_list('name', flat=True)

class ProfilePictureSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField()

    class Meta:
        model = User
        fields = ['profile_picture']

    def create(self, validated_data):
        try:
            firebase = pyrebase.initialize_app(settings.FIREBASE_CONFIG)
            storage = firebase.storage()
            profile_picture = validated_data['profile_picture']
            
            user = self.context['user']

            filename = f'profile_pictures/{user.username}/{profile_picture.name}'
            storage.child(filename).put(profile_picture)
            url = storage.child(filename).get_url(None)
            print(url)

            user.profile_picture = url
            user.save()

            return user
        except Exception as e:
            print(e)
            raise serializers.ValidationError("Something went wrong")    

class ProfilePictureField(serializers.Field):
    def to_internal_value(self, data):
        if not data: 
            return None

        if not data.content_type.startswith('image'):
            raise serializers.ValidationError("File type is not supported")

        return 'profile_picture' 

class PersonalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone', 'birth_date']

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

class ChangePasswordSerializer(serializers.Serializer):
    model = User

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class ForgotPasswordSerializer(serializers.ModelSerializer):
    # a serializer to update the email token if the email exists in the database
    # or raise an error if the email does not exist
    class Meta:
        model = User
        fields = ['email', 'email_token']

    # create a new email token and save it to the database
    def update(self, instance, validated_data):
        instance.email_token = str(uuid.uuid4())
        instance.save()
        return instance

class ResetPasswordSerializer(serializers.ModelSerializer):
    # a serializer to update the password if the email token is in the user's database
    # or raise an error if the email token does not exist
    class Meta:
        model = User
        fields = ['username', 'email_token', 'password']

    def validate(self, data):
        valid_data = super().validate(data)
        username = self.initial_data.get("username")
        given_email_token = self.initial_data.get("email_token")
        user = User.objects.get(username=username)

        if user.email_token != given_email_token:
            raise serializers.ValidationError("Email token does not match")
        
        return valid_data

    # update the password and save it to the database
    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()
        return instance
