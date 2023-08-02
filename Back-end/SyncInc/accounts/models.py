from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator
from project_api.models import Tag


class User(AbstractUser):
    created_at = models.DateTimeField(auto_now_add=True)
    username = models.CharField(
        _('username'),
        max_length=50,
        unique=True,
    )
    email = models.EmailField(max_length=254, unique=True)
    password = models.CharField(max_length=254)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    phone = models.CharField(
        _('phone number'),
        # a validator to check if the phone number is valid
        # phone number may or maynot contain country code
        validators=[RegexValidator(
            regex=r'^([0|\+[0-9]{1,5})?([0-9]{6,10})$')],
        max_length=16,
        help_text='e.g. 01712345678',
        blank=True,
    )

    birth_date = models.DateField(null=True, blank=True)
    address = models.CharField(max_length=254, blank=True)
    profile_picture = models.ImageField(
        upload_to='profile_pictures/', blank=True)
    
    email_token = models.CharField(max_length=254, default='')
    is_email_verified = models.BooleanField(default=False)

    tag = models.ManyToManyField(Tag, blank=True, null=True)

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email']

    def name(self):
        return self.first_name + ' ' + self.last_name

    def __str__(self):
        return self.username
    