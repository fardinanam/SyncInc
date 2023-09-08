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

    tags = models.ManyToManyField(Tag, blank=True)

    def __str__(self):
        return self.name
    
class Organization(models.Model):
    name = models.CharField(max_length=127, unique=True)
    employees = models.ManyToManyField(User, through='Designation')
    vendors = models.ManyToManyField(
        Vendor, 
        related_name='organizations',
        related_query_name='organization',
        blank=True
    )
    
    def __str__(self):
        return self.name
    
class Invitation(models.Model):
    organization = models.ForeignKey(
        Organization, 
        related_name='invitations',
        related_query_name='invitation',
        on_delete=models.CASCADE
    )

    invitee = models.ForeignKey(
        User, 
        related_name='invitations',
        related_query_name='invitation',
        on_delete=models.CASCADE
    )

    invited_by = models.ForeignKey(
        User, 
        related_name='invitations_sent',
        related_query_name='invitation_sent',
        on_delete=models.CASCADE
    )

    has_accepted = models.BooleanField(default=False)

class Designation(models.Model):
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('Employee', 'Employee'),
    ]

    employee = models.ForeignKey(
        User, 
        related_name='designations',
        related_query_name='designation',
        on_delete=models.CASCADE
    )
    organization = models.ForeignKey(
        Organization,
        related_name='designations',
        related_query_name='designation',
        on_delete=models.CASCADE
    )
    role = models.CharField(
        max_length=127,
        choices=ROLE_CHOICES,
        default='Employee',
    )

    invitationAccepted = models.BooleanField(default=False)
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
    start_time = models.DateTimeField(blank=True, null=True, auto_now_add=True)
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
    STATUS_CHOICES = [
        ('Unassigned', 'Unassigned'),
        ('In Progress', 'In Progress'),
        ('Submitted', 'Submitted'),
        ('Completed', 'Completed'),
        ('Rejected', 'Rejected'),
        ('Terminated', 'Terminated'),
    ]
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
        related_query_name='updated_tasks',
        blank=True, 
        null=True, 
        on_delete=models.SET_NULL
    )

    status = models.CharField(max_length=32, default='Unassigned', choices=STATUS_CHOICES)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(blank=True, null=True)
    deadline = models.DateTimeField()

    def clean(self):
        if self.previous_task and self.previous_task.project != self.project:
            raise ValidationError(
                "The previous task must be in the same project as the current task.")

        super().clean()

    def __str__(self):
        return self.name + '-' + self.project.__str__()

    class Meta:
        abstract = True
    
class UserTaskSubmission(models.Model):
    submission_time = models.DateTimeField(auto_now_add=True)
    file = models.URLField(max_length=254, null=True, blank=True)
    details = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.user_task.__str__() + ' - ' + self.submission_time.__str__()
    
class UserTask(AbstractTask):
    assignee = models.ForeignKey(
        User,
        related_name='usertasks',
        related_query_name='usertask',
        blank=True,
        null=True,
        on_delete=models.SET_NULL
    )

    submission = models.OneToOneField(
        UserTaskSubmission,
        related_name='user_task',
        related_query_name='user_task',
        blank=True,
        null=True,
        on_delete=models.SET_NULL
    )

    def clean(self):
        if self.assignee and self.assignee not in self.project.organization.employees.all():
            raise ValidationError(
                "The assignee must be an employee of the associated organization.")
        super().clean()
        

class UserTaskReview(models.Model):
    task = models.ForeignKey(
        UserTask,
        related_name='user_task_reviews',
        related_query_name='user_task_review',
        on_delete=models.CASCADE
    )

    reviewer = models.ForeignKey(
        User,
        related_name='reviews',
        related_query_name='review',
        on_delete=models.CASCADE
    )

    review_time = models.DateTimeField(auto_now_add=True)
    rating = models.IntegerField(blank=True, null=True)
    comment = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.task.__str__() + ' - ' + self.review_time.__str__()
    
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
        return self.vendor.name + '-' + self.task.name
    
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
    
class Notification(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_notifications")
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_notifications", default=1)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    sent = models.BooleanField(default=False)
    read = models.BooleanField(default=False)