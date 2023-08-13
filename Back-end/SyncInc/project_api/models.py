from django.db import models
from accounts.models import User, Address
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError


class Tag(models.Model):
    name = models.CharField(max_length=40, unique=True)
    users = models.ManyToManyField(
        User, 
        related_name='tags',
        related_query_name='tag',
        blank=True
    )

    def __str__(self):
        return self.name

class Vendor(models.Model):
    name = models.CharField(max_length=254)
    email = models.EmailField(max_length=254)
    address = models.ForeignKey(
        Address,
        related_name='vendors',
        related_query_name='vendor',
        on_delete=models.CASCADE
    )
    phone = models.CharField(
        _('phone number'),
        validators=[RegexValidator(
            regex=r'^([0|\+[0-9]{1,5})?([0-9]{6,10})$')],
        max_length=16,
        help_text='e.g. 01712345678',
        blank=True,
    )

    tag = models.ManyToManyField(Tag, blank=True)

    def __str__(self):
        return self.name
    
class Organization(models.Model):
    name = models.CharField(max_length=127)
    employees = models.ManyToManyField(User, through='Designation')
    vendors = models.ManyToManyField(
        Vendor, 
        related_name='organizations',
        related_query_name='organization',
        blank=True
    )
    
    def __str__(self):
        return self.name

class Designation(models.Model):
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('Employee', 'Employee'),
    ]

    employee = models.ForeignKey(
        User, 
        related_name='designations', # user.designations.all()
        related_query_name='designation',
        on_delete=models.CASCADE
    )
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE
    )
    role = models.CharField(
        max_length=127,
        choices=ROLE_CHOICES,
        default='Employee',
    )

    joined_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(blank=True, null=True)

    
    unique_together = ['employee', 'organization']

    def clean(self):
        # check if the user is already an employee of the organization
        if self.employee in self.organization.employees.all():
            raise ValidationError(
                'The user is already an employee of the organization')

    def __str__(self):
        return self.employee.__str__() + ' - ' + self.organization.__str__() + ' - ' + self.role
    
class Client(models.Model):
    organization = models.ForeignKey(
        Organization,
        related_name='clients',
        related_query_name='client',
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=127)
    email = models.EmailField(max_length=254)
    phone = models.CharField(
        _('phone number'),
        validators=[RegexValidator(
            regex=r'^([0|\+[0-9]{1,5})?([0-9]{6,10})$')],
        max_length=16,
        help_text='e.g. 01712345678',
        blank=True,
    )
    address = models.ForeignKey(
        Address,
        related_name='clients',
        related_query_name='client',
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )
    
    def __str__(self):
        return self.name

class Project(models.Model):
    organization = models.ForeignKey(
        Organization, 
        related_name='projects',
        related_query_name='project',
        on_delete=models.CASCADE
    )
    client = models.ForeignKey(
        Client,
        related_name='projects',
        related_query_name='project',
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )
    project_leader = models.ForeignKey(
        User, 
        related_name='projects_as_leader',
        related_query_name='project_as_leader',
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )
    
    name = models.CharField(max_length=254)
    description = models.TextField(blank=True, null=True)
    start_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)
    deadline = models.DateTimeField(blank=True, null=True)

    def clean(self):
        if self.project_leader and self.project_leader not in self.organization.employees.all():
            raise ValidationError(
                "The project leader must be an employee of the associated organization.")

        super().clean()

    def __str__(self):
        return self.name + ' - ' + self.organization.__str__()
    
class AbstractTask(models.Model):
    project = models.ForeignKey(
        Project, 
        related_name='%(class)ss',
        related_query_name='%(class)s', 
        on_delete=models.CASCADE
    )

    tags = models.ManyToManyField(
        Tag, 
        related_name='%(class)ss',
        related_query_name='%(class)s',
        blank=True,
        null=True
    )

    name = models.CharField(max_length=127)
    description = models.TextField(blank=True, null=True)
    
    previous_task = models.ForeignKey(
        'self', 
        related_name='updated_task',
        blank=True, 
        null=True, 
        on_delete=models.SET_NULL
    )

    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(blank=True, null=True)
    deadline = models.DateTimeField()

    def clean(self):
        if self.previous_task and self.previous_task.project != self.project:
            raise ValidationError(
                "The previous task must be in the same project as the current task.")

        super().clean()

    def __str__(self):
        return self.name + self.project.__str__()

    class Meta:
        abstract = True
    
class UserTask(AbstractTask):
    assignee = models.ForeignKey(
        User,
        related_name='usertasks',
        related_query_name='usertask',
        blank=True,
        null=True,
        on_delete=models.SET_NULL
    )

    file = models.FileField(upload_to='files/', blank=True)
    rating = models.IntegerField(blank=True, null=True)

    def clean(self):
        if self.assignee and self.assignee not in self.project.organization.employees.all():
            raise ValidationError(
                "The assignee must be an employee of the associated organization.")
        super().clean()
    
class VendorTask(AbstractTask):
    vendor = models.ForeignKey(
        Vendor, 
        related_name='vendortasks',
        related_query_name='vendortask',
        on_delete=models.CASCADE
    )

    def clean(self):
        if self.vendor not in self.project.organization.vendors.all():
            raise ValidationError(
                "The vendor must be a vendor of the associated organization.")
        
        return super().clean()

    def __str__(self):
        return self.vendor.name + ' - ' + self.task.name
    
class Message(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    text = models.TextField()
    user = models.ForeignKey(
        User, 
        related_name='messages',
        related_query_name='message',
        on_delete=models.SET_NULL, 
        null=True
    )
    project = models.ForeignKey(
        Project, 
        related_name='messages',
        related_query_name='message',
        on_delete=models.CASCADE
    )
    
    def clean(self):
        if self.user not in self.project.organization.employees.all():
            raise ValidationError(
                "The user must be an employee of the associated organization.")
        
        return super().clean()
    
    def __str__(self):
        return self.text