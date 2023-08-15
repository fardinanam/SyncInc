from rest_framework import serializers
from .models import *
from accounts.models import User
from django.db.models import Q, Avg, F

class OrganizationSerializer(serializers.ModelSerializer):
    num_projects = serializers.SerializerMethodField()
    num_members = serializers.SerializerMethodField()
    class Meta:
        model = Organization
        fields = ['id', 'name', 'num_projects', 'num_members']
    
    def get_num_projects(self, obj):
        return obj.projects.count()
    
    def get_num_members(self, obj):
        return obj.employees.count() + obj.vendors.count()
    
    def validate(self, data):
        valid_data = super().validate(data)
        user = self.initial_data.get('username')
        user = User.objects.get(username=user)

        designations = user.designations.all()

        for designation in designations:
            if designation.role == 'Admin' and designation.organization.name == valid_data['name']:
                raise serializers.ValidationError('Organization already exists for the user')
        return valid_data

    def create(self, validated_data):
        # check if the organization already exists for the user as an admin
        user = self.initial_data.get('username')
        user = User.objects.get(username=user)
        organization = super().create(validated_data)
        organization.save()
        Designation.objects.create(
            employee=user,
            organization=organization,
            role='Admin'
        ).save()
        return organization

class OrganizationProjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'projects']
        depth = 1
        # The depth attribute inside the Meta class determines the depth of relationships that 
        # should be included in the serialized output. The value 1 means that it will include 
        # the related objects' data for fields with a ForeignKey or OneToOneField relationship 
        # up to a depth of 1 level. In this case, if the projects field is a ForeignKey or 
        # OneToOneField to another model, the related object's data will be included in the 
        # serialized output.
class EmployeeSerializer(serializers.ModelSerializer):
    expertise = serializers.SerializerMethodField()
    completed_tasks = serializers.SerializerMethodField()
    avg_rating = serializers.SerializerMethodField()
    avg_time = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['name', 'expertise','completed_tasks', 'avg_rating', 'avg_time']

    def get_name(self, obj):
        return obj.first_name + ' ' + obj.last_name
    def get_expertise(self, obj):
        return obj.tags.all()
    def get_completed_tasks(self, obj):
        return obj.usertasks.filter(end_time__isnull=False).count()
    def get_avg_rating(self, obj):
        avg_rating = obj.usertasks.aggregate(Avg('rating'))['rating__avg']
        if avg_rating is None:
            return 0
        
    def get_avg_time(self, obj):
        finished_tasks = obj.usertasks.filter(end_time__isnull=False)
        avg_time = finished_tasks.all().aggregate(avg_time=Avg(F('end_time') - F('start_time')))['avg_time']
        if avg_time is None:
            return 'N/A'
    
class VendorSerializer(serializers.ModelSerializer):
    expertise = serializers.SerializerMethodField()
    completed_tasks = serializers.SerializerMethodField()
    avg_rating = serializers.SerializerMethodField()
    avg_time = serializers.SerializerMethodField()
    class Meta:
        model = Vendor
        fields = ['name', 'expertise', 'completed_tasks', 'avg_rating', 'avg_time']
    def get_expertise(self, obj):
        return obj.tags.all()
    def get_completed_tasks(self, obj):
        #get count of tasks that has finished using end_time. there is no status field
        return obj.vendortasks.filter(end_time__isnull=False).count()
        
    def get_avg_rating(self, obj):
        avg_rating = obj.vendortasks.aggregate(Avg('rating'))['rating__avg']
        if avg_rating is None:
            return 0
    
    def get_avg_time(self, obj):
        finished_tasks = obj.vendortasks.filter(end_time__isnull=False)
        avg_time = finished_tasks.all().aggregate(avg_time=Avg(F('end_time') - F('start_time')))['avg_time']
        if avg_time is None:
            return 'N/A'

class OrganizationMembersSerializer(serializers.ModelSerializer):
    employees = EmployeeSerializer(many=True)
    vendors = VendorSerializer(many=True)
    class Meta:
        model = Organization
        fields = ['id', 'name', 'employees', 'vendors']
        depth = 1

    
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['name', 'organization', 'client', 'description']
        
    def validate(self, data):
        valid_data = super().validate(data)
        user = self.initial_data.get('username')
        user = User.objects.get(username=user)

        designations = user.designations.all()
        print("serializer",valid_data)
        for designation in designations:
            if designation.role == 'Admin' and designation.organization.name == valid_data['name']:
                raise serializers.ValidationError('Organization already exists for the user')
        # # if client does not exist show error
        #             # if not client:
        #     raise serializers.ValidationError('Client not listed for this organization')
            
        # if client has same project name show error
        # if client and client.projects.filter(name=valid_data['name']).exists():
        #     raise serializers.ValidationError('Project already exists for the client')
            
        return valid_data
        
    def create(self, validated_data):
        client = validated_data['client']
        project = super().create(validated_data)
        project.save()
        client.projects.add(project)
        client.save()
            
        return project
        
class ProjectDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['name', 'organization', 'client', 'description']
        depth = 1

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['name']

class UserTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['name']