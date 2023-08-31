from rest_framework import serializers
from .models import *
from accounts.models import User
from django.db.models import Q, Avg, F
from datetime import datetime
from django.utils import timezone

class OrganizationSerializer(serializers.ModelSerializer):
    num_projects = serializers.SerializerMethodField()
    num_members = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Organization
        fields = ['id', 'name', 'num_projects', 'num_members', 'role']
    
    def get_role(self, obj):
        if not self.context.get('user'):
            return None
        
        user = self.context['user']
        designation = user.designations.get(organization=obj)
        if designation and designation.role:
            return designation.role
        return None
    
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
            role='Admin',
            invitationAccepted=True
        ).save()
        return organization

class ProjectSummarySerializer(serializers.ModelSerializer):
    task_count = serializers.SerializerMethodField()
    client = serializers.SerializerMethodField()
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'client', 'start_time', 'end_time', 'task_count']

    def get_task_count(self, obj):
        return obj.usertasks.count() + obj.vendortasks.count()
    def get_client(self, obj):
        return obj.client.name
    

    
class OrganizationProjectsSerializer(serializers.ModelSerializer):
    projects = serializers.SerializerMethodField()
    class Meta:
        model = Organization
        fields = ['id', 'name', 'projects']
        depth = 1

    def get_projects(self, obj):
        user = self.context['user']
        designation = Designation.objects.filter(organization = obj, employee = user).first()

        projects = obj.projects.all()
        project_list = []
        for project in projects:
            project_role = []

            if designation and designation.role == "Admin":
                project_role.append('Admin')
                
            if project.project_leader and project.project_leader == user:
                project_role.append('Project Leader')
            
            tasks = project.usertasks.filter(assignee=user)
            if tasks.exists():
                project_role.append('Assignee')

            project_list.append({
                'id': project.id,
                'name': project.name,
                'description': project.description,
                'client': project.client.name,
                'start_time': project.start_time,
                'end_time': project.end_time,
                'task_count': project.usertasks.count() + project.vendortasks.count(),
                'roles': project_role
            })
        return project_list
    


class EmployeeSerializer(serializers.ModelSerializer):
    expertise = serializers.SerializerMethodField()
    completed_tasks = serializers.SerializerMethodField()
    avg_rating = serializers.SerializerMethodField()
    avg_time = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'username',  'name', 'email', 'profile_picture', 'expertise','completed_tasks', 'avg_rating', 'avg_time']

    def get_name(self, obj):
        return obj.first_name + ' ' + obj.last_name
    def get_expertise(self, obj):
        tags = Tag.objects.filter(users=obj)
        tag_names = [tag.name for tag in tags]
        return tag_names
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
        tags = obj.tags.all()
        tag_names = [tag.name for tag in tags]
        return tag_names
        
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

class OrganizationEmployeeSerializer(serializers.ModelSerializer):
    employees = EmployeeSerializer(many=True)
    
    class Meta:
        model = Organization
        fields = ['id', 'name', 'employees']


class OrganizationVendorSerializer(serializers.ModelSerializer):
    vendors = VendorSerializer(many=True)

    class Meta:
        model = Organization
        fields = ['id', 'name', 'vendors']

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'organization', 'client', 'description']
        
    def validate(self, data):
        valid_data = super().validate(data)
        user = self.initial_data.get('username')
        user = User.objects.get(username=user)

        print("serializer",valid_data)
        
        #check if the project already exists in the organization
        projects = valid_data['organization'].projects.all( )
        print("projects")
        print(projects)
        print("\n\n")
        for project in projects:
            if project.name == valid_data['name']:
                raise serializers.ValidationError('Project already exists in the organization')
        return valid_data
        
    def create(self, validated_data):
        client = validated_data['client']
        project = super().create(validated_data)
        project.save()
        client.projects.add(project)
        client.save()
            
        return project

class ProjectDetailsSerializer(serializers.ModelSerializer):
    has_ended = serializers.SerializerMethodField()
    project_leader = serializers.SerializerMethodField()
    roles = serializers.SerializerMethodField()
    class Meta:
        model = Project
        fields = ['name', 'organization', 'project_leader', 'client', 'description', 'has_ended', 'roles']
        depth = 1

    def get_roles(self, obj):
        user = self.context['user']
        designation = user.designations.get(organization=obj.organization)
        project_role = []

        if obj.project_leader and obj.project_leader == user:
            project_role.append('Project Leader')
        if designation and designation.role:
            project_role.append(designation.role)
        return project_role
    
    def get_has_ended(self, obj):
        if obj.end_time and obj.end_time < datetime.now():
            return True
        return False
    
    def get_project_leader(self, obj):
        project_leader = obj.project_leader
        # return username, first_name, last_name, profile_pic url
        if project_leader:
            return {
                'username': project_leader.username,
                'email': project_leader.email,
                'first_name': project_leader.first_name,
                'last_name': project_leader.last_name,
                'profile_picture': project_leader.profile_picture
            } 
        
        return None
    
class DesignationSerializer(serializers.ModelSerializer):
    organization = serializers.SerializerMethodField()
    class Meta:
        model = Designation
        fields = ['id', 'organization'] 
    def get_organization(self, obj):
        return { 'name': obj.organization.name, 'id': obj.organization.id }
    
class InvitationSerializer(serializers.ModelSerializer):
    invited_by = EmployeeSerializer()
    organization = OrganizationSerializer()
    class Meta:
        model = Invitation
        fields = ['id', 'organization', 'invited_by', 'has_accepted']
    
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['name']
    
class GetUserTaskSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)
    assignee = EmployeeSerializer()
    status = serializers.SerializerMethodField()
    project_name = serializers.SerializerMethodField()
    organization_name = serializers.SerializerMethodField()

    class Meta:
        model = UserTask
        fields = ['id', 'name', 'tags', 'assignee', 'deadline', 'status', 'project_name', 'organization_name']

    def get_status(self, obj):
        # if deadline has passed and task is not submitted or completed or rejected: task is overdue
        # if task is submitted: task is submitted
        # if task is completed: task is completed
        # if task is rejected: task is rejected
        # if assignee is none: task is unassigned
        if obj.status == 'Submitted':
            return 'Submitted'
        elif obj.status == 'Completed':
            return 'Completed'
        elif obj.status == 'Rejected':
            return 'Rejected'
        elif obj.assignee is None:
            return 'Unassigned'
        elif obj.deadline < timezone.now():
            return 'Overdue'
        else:
            return 'In Progress'
        
    def get_project_name(self, obj):
        return obj.project.name

    def get_organization_name(self, obj):
        return obj.project.organization.name

class VendorTaskSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)

    class Meta:
        model = VendorTask
        fields = ['id', 'name', 'tags', 'assignee', 'deadline']
        depth = 1


class UserTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['name']
    
class CreateUserTaskSerializer(serializers.ModelSerializer):
    # a serializer to create a task of a project
    tags = serializers.ListField(write_only=True)
    tags_details = TagSerializer(source='tags', many=True, read_only=True)
    
    class Meta:
        model = UserTask
        fields = '__all__'
    
    def validate(self, data):
        valid_data = super().validate(data)
        project = valid_data['project']
        name = valid_data['name']
        if project.usertasks.filter(name=name).exists():
            raise serializers.ValidationError(f'Task named {name} already exists for this project')
        return valid_data
    
    def create(self, validated_data):
        tags_data = validated_data.pop('tags')
        task = UserTask.objects.create(**validated_data)

        for tag_name in tags_data:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            task.tags.add(tag)

        return task

