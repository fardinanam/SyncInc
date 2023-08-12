from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator
import os

class Address(models.Model):
    street = models.CharField(max_length=254)
    city = models.CharField(max_length=50)
    country = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)

    def __str__(self):
        return str(self.id)

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
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True)
    profile_picture = models.ImageField(
        upload_to='profile_pictures/', blank=True)
    
    email_token = models.CharField(max_length=254, default='')
    is_email_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def save(self, *args, **kwargs):
        try:
            # Retrieve the current object from the database
            old_instance = User.objects.get(pk=self.pk)
        except User.DoesNotExist:
            pass  # Object is new, so there's no previous file to delete
        else:
            # Delete the previous profile_picture file only if new profile_picture is uploaded
            if old_instance.profile_picture and self.profile_picture and self.profile_picture != old_instance.profile_picture:
                if os.path.isfile(old_instance.profile_picture.path):
                    os.remove(old_instance.profile_picture.path)
        
        super(User, self).save(*args, **kwargs)
    

    def name(self):
        return self.first_name + ' ' + self.last_name

    def __str__(self):
        return self.username
    