from rest_framework import serializers
from .models import Organization, Designation, Project, Client
from accounts.models import User

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['name']

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
    
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['name', 'organization', 'client', 'description']
        
        def validate(self, data):
            valid_data = super().validate(data)
            organization = self.initial_data.get('organization')
            user = self.initial_data.get('username')
            user = User.objects.get(username=user)
            organization = user.organizations.get(name=organization)
            client = organization.clients.filter(name=valid_data['client']).first()
            
            # # if client does not exist show error
            # if not client:
            #     raise serializers.ValidationError('Client not listed for this organization')
            
            # if client has same project name show error
            if client and client.projects.filter(name=valid_data['name']).exists():
                raise serializers.ValidationError('Project already exists for the client')
            
            return valid_data
        
        def create(self, validated_data):
            user = self.validated_data.get('username')
            user = User.objects.get(username=user)
            organization = user.organizations.get(name=validated_data['organization'])
            client = organization.clients.filter(name=validated_data['client'])
            
            if not client:
                Client.objects.create(
                    organization=organization,
                    name=validated_data['client']
                ).save()
            
            project = super().create(validated_data)
            project.save()
            client.projects.add(project)
            client.save()
            
            return project
            
            