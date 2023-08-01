from django.db import models
from accounts.models import User

# Create your models here.
#create a model for project that will have id, name, description, start time, completion time, deadline
class Project(models.Model):
    name = models.CharField(max_length=254)
    description = models.TextField()
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name
    
#create a model for task that will have id, name, description, start time, completion time, deadline and rating.
#it will also have project id as foreign key
class Task(models.Model):
    name = models.CharField(max_length=254)
    description = models.TextField()
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(auto_now_add=True)
    # file = models.FileField(upload_to='files/', blank=True)
    rating = models.IntegerField()
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    def __str__(self):
        return self.name
    
#create a model for vendor that has name, email, contact and address
class Vendor(models.Model):
    name = models.CharField(max_length=254)
    email = models.EmailField(max_length=254)
    contact = models.CharField(max_length=254)
    address = models.CharField(max_length=254)
    def __str__(self):
        return self.name
    

#create a model for message that will have id as primary key, timestamp, text. userid and project id as foreign key
class Message(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    text = models.TextField()
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    def __str__(self):
        return self.text
 
#create a model task assignment that will have task id and user id as foreign key, they both are primary key
class TaskAssignment(models.Model):
    task_id = models.ForeignKey(Task, on_delete=models.CASCADE, primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, primary_key=True)
    def __str__(self):
        return self.task_id.name + ' ' + self.user_id.name
    
#create a model for expertise that will have name as primary key, user id as foreign key
class Tag(models.Model):
    name = models.CharField(max_length=254, primary_key=True)
    def __str__(self):
        return self.name# your code goes here
    
class UserTag(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    tag_name = models.ForeignKey(Tag, on_delete=models.CASCADE)
    PRIMARY_KEY = ('user_id', 'tag_name')
    def __str__(self):
        return self.user_id.name + ' ' + self.tag_name.name

class VendorTag(models.Model):
    vendor_id = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    tag_name = models.ForeignKey(Tag, on_delete=models.CASCADE)
    #make vendor id and tag name as primary key
    PRIMARY_KEY = ('vendor_id', 'tag_name')

    def __str__(self):
        return self.vendor_id.name + ' ' + self.tag_name.name