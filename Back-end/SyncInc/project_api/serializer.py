from rest_framework import serializers
from .models import *
from accounts.models import User
from django.db.models import Q, Avg, F
from datetime import datetime
from django.utils import timezone
from django.conf import settings
import pyrebase
from django.db.models import Value

class OrganizationSerializer(serializers.ModelSerializer):
    num_projects = serializers.SerializerMethodField()
    num_members = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField(read_only=True)
    admin = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Organization
        fields = ['id', 'name', 'num_projects', 'num_members', 'role', 'admin']
    
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
    
    def get_admin(self, obj):
        admin = Designation.objects.filter(organization=obj, role='Admin').first().employee
        if admin:
            return {
                'username': admin.username,
                'email': admin.email,
                'name': admin.first_name + ' ' + admin.last_name,
                'profile_picture': admin.profile_picture
            }
        return None
    
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
    roles = serializers.SerializerMethodField()
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'client', 'start_time', 'end_time', 'task_count', 'roles']

    def get_task_count(self, obj):
        return obj.usertasks.count() + obj.vendortasks.count()
    def get_client(self, obj):
        return obj.client.name
    def get_roles(self, obj):
        return obj.roles
    
class UserProjectsSerializer(serializers.ModelSerializer):
    projects = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['projects']
    def get_projects(self, obj):
        # get organizations where user is admin
        user_organizations = obj.designations.filter(role='Admin').values('organization')
        #get projects of these organizations
        projects_as_admin = Project.objects.filter(organization__in=user_organizations)
        #get projects where user is project leader
        projects_as_leader = Project.objects.filter(project_leader=obj)
        #get projects where user is employee
        projects_id_as_employee = obj.usertasks.values('project').distinct()
        # print("projects id as employee", projects_id_as_employee)
        projects_as_employee = Project.objects.filter(id__in=projects_id_as_employee)
        user_all_projects = projects_as_admin.union(projects_as_leader, projects_as_employee)

        projects = []
        for project in user_all_projects:
            roles = []
            if project in projects_as_admin:
                roles.append('Admin')
            if project in projects_as_leader:
                roles.append('Project Leader')
            if project in projects_as_employee:
                roles.append('Assignee')
            projects.append({
                'id': project.id,
                'name': project.name,
                'description': project.description,
                'client': project.client.name,
                'start_time': project.start_time,
                'end_time': project.end_time,
                'task_count': project.usertasks.count() + project.vendortasks.count(),
                'roles': roles
            })
        return projects
       
    
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
        return obj.usertasks.filter(end_time__isnull=False, status='Completed').count()
    def get_avg_rating(self, obj):
        # avg_rating = obj.usertasks.aggregate(Avg('rating'))['rating__avg']
        # calculate average rating from reviews
        avg_rating = obj.reviews.all().aggregate(avg_rating=Avg('rating'))['avg_rating']

        if avg_rating is None:
            return 0
        return avg_rating
        
    def get_avg_time(self, obj):
        finished_tasks = obj.usertasks.filter(status__in=['Completed','Rejected'])
        avg_time = finished_tasks.all().aggregate(avg_time=Avg(F('end_time') - F('start_time')))['avg_time']
    
        if avg_time is None:
            return 'N/A'

        # avg_time = datetime()
        return avg_time
    
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
    project_leader = serializers.SerializerMethodField()
    roles = serializers.SerializerMethodField()
    task_count = serializers.SerializerMethodField()
    class Meta:
        model = Project
        fields = ['name', 'organization', 'project_leader', 'client', 'description', 'roles', 'start_time', 'end_time', 'task_count', 'deadline']
        depth = 1

    def get_task_count(self, obj):
        return obj.usertasks.count() + obj.vendortasks.count()
    
    def get_roles(self, obj):
        user = self.context['user']
        designation = user.designations.get(organization=obj.organization)
        project_role = []

        if obj.project_leader and obj.project_leader == user:
            project_role.append('Project Leader')
        if designation and designation.role:
            project_role.append(designation.role)
        return project_role
    
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

class UserTaskSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTaskSubmission
        fields = ['file', 'details', 'submission_time']
    

class UserTaskReviewSerializer(serializers.ModelSerializer):
    reviewer = EmployeeSerializer(read_only=True)

    class Meta:
        model = UserTaskReview
        fields = ['id', 'reviewer', 'rating', 'comment', 'review_time']

class GetUserTaskSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)
    assignee = EmployeeSerializer()
    status = serializers.SerializerMethodField()
    project = serializers.SerializerMethodField()
    organization = serializers.SerializerMethodField()
    roles = serializers.SerializerMethodField()
    submission = UserTaskSubmissionSerializer()
    user_task_reviews = UserTaskReviewSerializer(many=True)
    previous_task = serializers.SerializerMethodField()
    updated_task = serializers.SerializerMethodField()

    class Meta:
        model = UserTask
        fields = ['id', 'name', 'tags', 'assignee', 'deadline', 'status', 'project',
                'organization', 'description', 'roles', 'submission', 'end_time', 'user_task_reviews', 'previous_task', 'updated_task']

    def get_roles(self, obj):
        if not self.context.get('user'):
            return None
        
        user = self.context['user']

        roles = []
        if obj.assignee and obj.assignee == user:
            roles.append('Assignee')
        if obj.project.project_leader == user:
            roles.append('Project Leader')

        designation = user.designations.filter(
            organization=obj.project.organization).first()
        if designation and designation.role == 'Admin':
            roles.append('Admin')
        
        return roles
    
    def get_previous_task(self, obj):
        if obj.previous_task:
            return {
                'id': obj.previous_task.id,
                'name': obj.previous_task.name,
            }
        return None
    
    def get_updated_task(self, obj):
        updated_task = UserTask.objects.filter(previous_task=obj).first()
        
        if updated_task:
            return {
                'id': updated_task.id,
                'name': updated_task.name,
            }
        return None
        

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
        elif obj.status == 'Terminated':
            return 'Terminated'
        elif obj.assignee is None:
            return 'Unassigned'
        elif obj.deadline < timezone.now():
            return 'Overdue'
        else:
            return 'In Progress'
        
    def get_project(self, obj):
        project = {'name': obj.project.name, 'id': obj.project.id, 'deadline': obj.project.deadline}
        return project

    def get_organization(self, obj):
        organization={'name': obj.project.organization.name, 'id': obj.project.organization.id}

        return organization

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
        task = self.instance
        previous_task = valid_data.get('previous_task', None)

        if previous_task and previous_task.project != project:
            raise serializers.ValidationError('Previous task is not in the same project')
        
        hasUpdatedTask = UserTask.objects.filter(previous_task=previous_task).exists()
        if previous_task and hasUpdatedTask:
            print('updated task', previous_task.updated_task)
            raise serializers.ValidationError('The previous task is already updated')
        
        if not task and project.usertasks.filter(name=name).exists():
            raise serializers.ValidationError(f'Task named {name} already exists for this project')
        return valid_data
    
    def create(self, validated_data):
        tags_data = validated_data.pop('tags')
        task = UserTask.objects.create(**validated_data)

        for tag_name in tags_data:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            task.tags.add(tag)

        return task

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags')
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get(
            'description', instance.description)
        instance.deadline = validated_data.get('deadline', instance.deadline)
        instance.save()

        instance.tags.clear()
        for tag_name in tags_data:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            instance.tags.add(tag)
        return instance
    
class SubmitUserTaskSerializer(serializers.ModelSerializer):
    file = serializers.FileField(required=True, allow_empty_file=False, write_only=True)
    class Meta:
        model = UserTask
        fields = ['id', 'status', 'submission', 'file']
    
    def validate(self, data):
        valid_data = super().validate(data)
        task = self.instance
        if task.status == 'Submitted':
            raise serializers.ValidationError('Task already submitted')
        if task.status == 'Completed':
            raise serializers.ValidationError('Task already completed')
        if task.status == 'Rejected':
            raise serializers.ValidationError('Task already rejected')
        if task.assignee is None:
            raise serializers.ValidationError('Task is unassigned')
        return valid_data
    
    def update(self, instance, validated_data):
        try:
            firebase = pyrebase.initialize_app(settings.FIREBASE_CONFIG)
            storage = firebase.storage()
            file = validated_data['file']

            project = instance.project
            organization = project.organization
            filename = f'files/{organization.name}_{organization.id}/{project.name}/{instance.name}/{file.name}'
            storage.child(filename).put(file)
            url = storage.child(filename).get_url(None)
            # print metadata

            instance.submission = UserTaskSubmission.objects.create(file=url, details=self.initial_data.get('details', None))    
            instance.status = 'Submitted'
            instance.save()
            
            return instance
        except Exception as e:
            print(e)
            raise serializers.ValidationError("Something went wrong")


class UpdateUserTaskStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTask
        fields = ['status', 'end_time']
    
    def validate(self, data):
        valid_data = super().validate(data)
        task = self.instance

        if valid_data['status'] != 'Completed' and valid_data['status'] != 'Rejected' and valid_data['status'] != 'Terminated':
            raise serializers.ValidationError('Invalid status')
        if task.status == 'Completed':
            raise serializers.ValidationError('Task already completed')
        if task.status == 'Rejected':
            raise serializers.ValidationError('Task already rejected')
        if task.status == 'Terminated':
            raise serializers.ValidationError('Task already terminated')
        if task.assignee is None and valid_data['status'] != 'Terminated':
            raise serializers.ValidationError('Task is unassigned')
        return valid_data
    
    def update(self, instance, validated_data):
        instance.status = validated_data['status']
        instance.end_time = timezone.now()
        instance.save()
        return instance

class UpdateUserTaskRatingSerializer(serializers.ModelSerializer):
    rating = serializers.IntegerField(min_value=1, max_value=5, write_only=True)
    comment = serializers.CharField(max_length=256, write_only=True, allow_blank=True)
    user_task_reviews = UserTaskReviewSerializer(read_only=True, many=True)

    class Meta:
        model = UserTask
        fields = ['user_task_reviews', 'rating', 'comment']
    
    def validate(self, data):
        valid_data = super().validate(data)
        task = self.instance
        reviewer = self.context['user']

        admin = Designation.objects.filter(organization=task.project.organization, employee=reviewer, role='Admin')

        if reviewer != task.project.project_leader and not admin.exists():
            raise serializers.ValidationError('Only project leader and admin can review')        

        if task.status != 'Completed' and task.status != 'Rejected':
            raise serializers.ValidationError('Task is not completed')

        if valid_data['rating'] > 5 or valid_data['rating'] < 1:
            raise serializers.ValidationError('Invalid rating')
        
        return valid_data
    
    def update(self, instance, validated_data):
        review = UserTaskReview.objects.filter(task=instance, reviewer=self.context['user'])

        if not review.exists():
            review = UserTaskReview.objects.create(task=instance, reviewer=self.context['user'])
        else:
            review = review.first()

        review.rating = validated_data['rating']
        review.comment = validated_data['comment']
        review.review_time = timezone.now()

        review.save()
        instance.review = review

        instance.save()
        return instance
class BasicUserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'name', 'email', 'profile_picture']
        
class NotificationSerializer(serializers.ModelSerializer):
    sender = BasicUserInfoSerializer()
    class Meta:
        model = Notification
        fields = ['id', 'sender', 'type', 'attribute_id', 'message', 'created_at', 'read']
    
class UpdateProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['name', 'description', 'deadline']
    
    def validate(self, data):
        valid_data = super().validate(data)
        project = self.instance
        if project.end_time and project.end_time < timezone.now():
            raise serializers.ValidationError('Project has already ended')
        return valid_data
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get(
            'description', instance.description)
        instance.deadline = validated_data.get('deadline', instance.deadline)
        instance.save()
        return instance
