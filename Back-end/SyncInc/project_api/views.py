from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .models import *
from .serializer import *
from .utils import *
from datetime import date
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async

def notify_user(sender, receiver, type, attribute_id, message):
    
    notification = Notification.objects.create(
            sender = sender,
            receiver = receiver,
            type = type,
            attribute_id = attribute_id,
            message = message
    )
    receiver_name = receiver.username
    notification_serializer = NotificationSerializer(notification)
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'ws_{receiver_name}', {
            "type": "notification_message",
            "message": notification_serializer.data
        }
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_organizations(request):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        designations = user.designations.all()
        organizations = [designation.organization for designation in designations]
        serializer = OrganizationSerializer(organizations, many=True, context={'user': user})
        
        return Response({
            'message': f'Organizations of {user.username} fetched successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_organization(request, organization_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        designations = user.designations.all()
        organization = Organization.objects.get(id=organization_id)
        serializer = OrganizationSerializer(organization, context={'user': user})
        
        return Response({
            'message': f'Organization {organization.name} fetched successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_organization_role(request, organization_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)


        organization = Organization.objects.get(id=organization_id)
        designation = user.designations.filter(organization=organization).first()

        if not designation:
            return Response({
                'message': 'You are not authorized to view this organization',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        role = designation.role

        return Response({
            'message': f'Role in the organization {organization.name}',
            'data': role
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_projects(request):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        serializer = UserProjectsSerializer(user)
        # print(serializer.data)
        return Response({
            'message': 'Projects fetched successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)        
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_organization_projects(request, organization_id):
    """
        Get organization name and all the projects of the organization
        from the given organization id
    """
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        organization = Organization.objects.get(id=organization_id)

        serializer = OrganizationProjectsSerializer(organization, context={'user': user})
        data = serializer.data
        designation = Designation.objects.filter(organization=organization, employee=user).first()

        if not designation:
            return Response({
                'message': 'You are not authorized to view this organization',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        role = designation.role
        data['role'] = role

        return Response({
            'message': f'Projects of the organization {organization.name}',
            'data': data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_organization_employees(request, organization_id):
    """
        Get organization name and all the employees of the organization
        from the given organization id
    """
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        organization = Organization.objects.get(id=organization_id)

        serializer = OrganizationEmployeeSerializer(organization)
        data = serializer.data

        designation = user.designations.filter(organization=organization).first()
        role = designation.role
        data['role'] = role


        isEmployee = user.designations.filter(organization=organization).exists()
  
        if not isEmployee:
            return Response({
                'message': 'You are not authorized to view the members of this organization',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        return Response({
            'message': f'Members of the organization {organization.name}',
            'data': data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_organization_vendors(request, organization_id):
    """
        Get organization name and all the vendors of the organization
        from the given organization id
    """
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        organization = Organization.objects.get(id=organization_id)
        
        serializer = OrganizationVendorSerializer(organization)
        data = serializer.data

        designation = user.designations.filter(organization=organization).first()
        role = designation.role
        data['role'] = role


        isEmployee = user.designations.filter(
            organization=organization).exists()

        if not isEmployee:
            return Response({
                'message': 'You are not authorized to view the members of this organization',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        return Response({
            'message': f'Members of the organization {organization.name}',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_organization(request):
    try:
        # process the organization data
        username = get_data_from_token(request, 'username')

        data = request.data
        data['username'] = username
        
        user = User.objects.get(username=username)

        serializer = OrganizationSerializer(data=data, context={'user': user})

        if not serializer.is_valid():
            print("serializer errors", serializer.errors)
            return Response({
                'message': 'Something went wrong',
                'data': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()

        return Response({
            'message': 'Organization created successfully',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project(request, organization_id):
    try:
        username = get_data_from_token(request, 'username')

        user = User.objects.get(username=username)
        organization = Organization.objects.get(id=organization_id)

        # check if the user is an admin of the organization
        designation = user.designations.filter(organization=organization).first()

        if designation and designation.role != 'Admin':
            return Response({
                'message': 'You are not authorized to add new project to this organization',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        data = request.data
        data['username'] = username
        #client only has client name, not its id
        client, created = Client.objects.get_or_create(
            organization=organization,
            name=data['client']
        )
        data['client'] = client.id
        serializer = ProjectSerializer(data=data)

        
        if not serializer.is_valid():
            return Response({
                'message': serializer.errors.get('non_field_errors')[0],
                'data': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        project = serializer.save()

        return Response({
            'message': 'Project created successfully',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_employee_suggestions(request, organization_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        organization = Organization.objects.get(id=organization_id)
        designation = user.designations.filter(organization=organization).first()

        if designation and designation.role != 'Admin':
            return Response({
                'message': 'You are not authorized to get new employee suggestion for this organization',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        
        employees = User.objects.exclude(designation__organization=organization).values( 'id','username', 'email', 'profile_picture')

        return Response({
            'message': f'New member suggestion for the organization {organization.name}',
            'data': employees
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_vendor_suggestions(request, organization_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        # check if the user is an admin of the organization
        organization = Organization.objects.get(id=organization_id)
        designation = user.designations.filter(organization=organization).first()

        if designation and designation.role != 'Admin':
            return Response({
                'message': 'You are not authorized to get new vendor suggestion for this organization',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        vendors = Vendor.objects.exclude(organization=organization).annotate(username=F('name')).values('id','username', 'email')

        return Response({
            'message': f'New member suggestion for the organization {organization.name}',
            'data': vendors
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def invite_employee(request, organization_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        organization = Organization.objects.get(id=organization_id)

        if not organization:
            return Response({
                'message': 'Organization not found',
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        designation = user.designations.filter(organization=organization).first()

        if designation and designation.role != 'Admin':
            return Response({
                'message': 'You are not authorized to invite new employee to this organization',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        data = request.data
        member_id = data['id']
        employee = User.objects.get(id=member_id)

        
        # check if the employee is already a member of the organization

        if not employee:
            return Response({
                'message': 'User not found',
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if employee.designations.filter(organization=organization).exists():
            return Response({
                'message': 'Employee is already a member of the organization',
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if employee.invitations.filter(organization=organization).exists():
            return Response({
                'message': 'Employee is already invited to the organization',
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        invitation = Invitation.objects.create(
            organization=organization,
            invitee=employee,
            invited_by=user
        )

        invitation.save()
        data = EmployeeSerializer(employee).data
        
        type = 'org_invite'
        message = user.username +" has invited you to join " + organization.name + " organization"
        
        notify_user(user, employee, type, organization.id, message)
        
        return Response({
            'message': f'Invitation sent successfully to the {employee.name}',
            'data': data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_invites(request):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)
        
        invitations = Invitation.objects.filter(invitee=user, has_accepted=False)
        serializer = InvitationSerializer(invitations, many=True)

        return Response({
                'message': f'Invites of {username}',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def accept_invite(request, invitation_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        invitation = Invitation.objects.get(id=invitation_id)

        if not invitation:
            return Response({
                'message': 'Invitation not found',
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if invitation.invitee != user:
            return Response({
                'message': 'You are not authorized to accept this invite',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        organization = invitation.organization
        designation = Designation.objects.create(
            employee=user,
            organization=organization,
            role='Employee',
            invitationAccepted=True
        )

        if designation:
            invitation.delete()
            designation.save()
        
        invited_by = invitation.invited_by
        message = username + " accepted your invitation to join " + organization.name + " organization"
        type = 'org_invite_ac'
        notify_user(user, invited_by, type, organization.id, message)

        return Response({
            'message': f'Invite accepted successfully',
            'data': None
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        })
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def reject_invite(request, invitation_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        invitation = Invitation.objects.get(id=invitation_id)

        if not invitation:
            return Response({
                'message': 'Invitation not found',
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)

        if invitation.invitee != user:
            return Response({
                'message': 'You are not authorized to reject this invite',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        invitation.delete()

        return Response({
            'message': f'Invite rejected successfully',
            'data': None
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_vendor(request, organization_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        organization = Organization.objects.get(id=organization_id)
        designation = user.designations.filter(organization=organization).first()

        if designation and designation.role != 'Admin':
            return Response({
                'message': 'You are not authorized to add new vendor to this organization',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        data = request.data
        member_id = data['id']

        vendor = Vendor.objects.get(id=member_id)
        vendor.organizations.add(organization)
        vendor.save()

        data = VendorSerializer(vendor).data

        return Response({
            'message': f'Member added successfully to the {organization.name}',
            'data': data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_project(request, project_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        project = Project.objects.get(id=project_id)

        if not project:
            raise Exception('Project not found')

        # # check if the user is an admin of the organization
        # designation = user.designations.filter(organization=project.organization).first()
        
        # project_role = []

        # if project.project_leader == user:
        #     project_role.append('Project Leader')
        # if designation and designation.role:
        #     project_role.append(designation.role)
        # else:
        #     return Response({
        #         'message': 'You are not authorized to view this project',
        #         'data': None
        #     }, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = ProjectDetailsSerializer(project, context={'user': user})
        
        # serializer.data['project_role'] = project_role

        if serializer.data['roles'] == None:
            return Response({
                'message': 'You are not authorized to view this project',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            'message': 'Project details',
            'data': serializer.data

        }, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_tags(request):
    try:
        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)

        return Response({
            'message': 'Tags fetched successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_or_create_user_tags(request):
    try:
        # for every tag, see if the tag exists, if not create it, then add it to the user if not already added
        # if there is a tag in the user that is not in the data, remove it from user
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        data = request.data
        tags = data['tags']
        
        for tag in tags:
            tag_obj, created = Tag.objects.get_or_create(name=tag)
            user.tags.add(tag_obj)

        # remove the tags that are not in the data
        user_tags = user.tags.all()
        for user_tag in user_tags:
            if user_tag.name not in tags:
                user.tags.remove(user_tag)

        serializer = UserTagSerializer(user.tags, many=True)

        return Response({
            'message': 'Tags set successfully',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_tasks(request, project_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        project = Project.objects.get(id=project_id)

        if not project:
            raise Exception('Project not found')

        # check if the user is an admin of the organization or project leader
        designation = user.designations.filter(organization=project.organization).first()

        tasks = UserTask.objects.filter(project=project)

        if not ((designation and designation.role == 'Admin') or project.project_leader == user or tasks.filter(assignee=user).exists()):
            return Response({
                'message': 'You are not authorized to view this project',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        serializer = GetUserTaskSerializer(tasks, many=True)

        return Response({
            'message': 'User tasks fetched successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_vendor_tasks(request, project_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        project = Project.objects.get(id=project_id)

        if not project:
            raise Exception('Project not found')

        # check if the user is an admin of the organization or project leader
        designation = user.designations.filter(organization=project.organization).first()

        tasks = VendorTask.objects.filter(project=project)

        # check if the user is an admin of the organization or project leader
        # or a member of the project
        has_user_task = UserTask.objects.filter(project=project, assignee=user).exists()

        if not ((designation and designation.role == 'Admin') or project.project_leader == user or has_user_task):
            return Response({
                'message': 'You are not authorized to view this project',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        serializer = VendorTaskSerializer(tasks, many=True)

        return Response({
            'message': 'Vendor tasks fetched successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_task(request, project_id):
    # check if the user is the project leader
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        project = Project.objects.get(id=project_id)

        if project.project_leader != user:
            return Response({
                'message': 'You are not authorized to create task for this project',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        data = request.data
        data['project'] = project_id
        serializer = CreateUserTaskSerializer(data=data)

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response({
            'message': 'Task created successfully',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        print(e)        
        return Response({
            'message': serializer.errors.get('non_field_errors')[0],
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def assign_user_task(request):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        data = request.data
        task_id = data['id']
        task = UserTask.objects.get(id=task_id)

        if task.project.project_leader != user:
            return Response({
                'message': 'You are not authorized to assign task for this project',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        if task.assignee:
            return Response({
                'message': 'Task already assigned',
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)

        assignee = User.objects.get(id=data['assignee'])

        if not assignee:
            return Response({
                'message': 'User not found',
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        task.assignee = assignee
        task.status = 'In Progress'
        task.save()

        serializer = GetUserTaskSerializer(task)

        if assignee != user:
            message = "You are assigned a new task " + task.name + " in project "+ task.project.name
            type = 'task'
            notify_user(user, assignee, type, task.id, message)

        return Response({
            'message': 'Task assigned successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)        
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_items_count(request):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)
        
        designations = user.designations.all()
        
        data = {}
        data['numOrganizations'] = Organization.objects.filter(designation__in=designations).count()
        data['numProjects'] = 0
        for project in Project.objects.filter(organization__designation__in=designations):
            designation = Designation.objects.filter(organization=project.organization, employee=user).first()
            if designation.role == 'Admin' or project.project_leader == user or UserTask.objects.filter(project=project, assignee=user).exists():
                data['numProjects'] += 1

        data['numCompletedProjects'] = 0
        for project in Project.objects.filter(organization__designation__in=designations, end_time__isnull=False):
            designation = Designation.objects.filter(organization=project.organization, employee=user).first()
            if designation.role == 'Admin' or project.project_leader == user or UserTask.objects.filter(project=project, assignee=user).exists():
                data['numCompletedProjects'] += 1

        data['numTasks'] = UserTask.objects.filter(assignee=user).count()
        data['numCompletedTasks'] = UserTask.objects.filter(assignee=user, status="Completed").count()
        print(data)
        return Response({
            'message': f'Item counts of {user.username} fetched successfully',
            'data': data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_project_leader_suggestions(request, project_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        project = Project.objects.get(id=project_id)
        # check if the user is an Admin of the organization of the project
        designation = user.designations.filter(organization=project.organization).first()

        if not designation or designation.role != 'Admin':
            return Response({
                'message': 'You are not authorized to get project leader suggestion for this project',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        # get all the employees of the organization
        employees = User.objects.filter(designation__organization=project.organization).values('id','username', 'email', 'profile_picture')

        return Response({
            'message': 'Project leader suggestion fetched successfully',
            'data': employees
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)        
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_project_leader(request, project_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        project = Project.objects.get(id=project_id)
        # check if the user is an Admin of the organization of the project
        designation = user.designations.filter(organization=project.organization).first()

        if not designation or designation.role != 'Admin':
            return Response({
                'message': 'You are not authorized to assign project leader for this project',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        data = request.data
        project_leader_id = data['id']
        project_leader = User.objects.get(id=project_leader_id)

        if not project_leader:
            return Response({
                'message': 'User not found',
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)

        project.project_leader = project_leader
        project.save()

        serializer = EmployeeSerializer(project_leader)

        if user != project_leader:
            type = 'project'
            message = user.username +" has made you leader of " + project.name + " project"
            notify_user(user, project_leader, type, project.id, message)

        return Response({
            'message': 'Project leader assigned successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)        
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_tasks_of_user(request):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        # get all the tasks assigned to the user
        tasks = UserTask.objects.filter(assignee=user)

        serializer = GetUserTaskSerializer(tasks, many=True)

        return Response({
            'message': 'Tasks fetched successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)        
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_task(request, task_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        # get all the tasks assigned to the user
        task = UserTask.objects.get(id=task_id)

        serializer = GetUserTaskSerializer(task, context={'user': user})

        if not serializer.data['roles']:
            return Response({
                'message': 'You are not authorized to view this task',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        
        return Response({
            'message': 'Task fetched successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)        
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_task_details(request, task_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        # get all the tasks assigned to the user
        task = UserTask.objects.get(id=task_id)

        # check if the user is a project leader
        if not task.project.project_leader or task.project.project_leader != user:
            return Response({
                'message': 'You are not authorized to update this task',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        serializer = CreateUserTaskSerializer(data=request.data, instance=task)

        serializer.is_valid(raise_exception=True)

        serializer.save()
        serializer = GetUserTaskSerializer(task, context={'user': user})
        
        return Response({
            'message': 'Task updated successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)        
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes((MultiPartParser, FormParser,))
def submit_user_task(request, task_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        # get all the tasks assigned to the user
        task = UserTask.objects.get(id=task_id)

        # check if the user is the assignee of the task
        if not task.assignee or task.assignee != user:
            return Response({
                'message': 'You are not authorized to submit this task',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        serializer = SubmitUserTaskSerializer(data=request.data, instance=task)

        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        serializer = GetUserTaskSerializer(task, context={'user': user})
        
        project_leader = task.project.project_leader
        
        if user != project_leader:
            message = user.username + " submitted task " + task.name
            type = 'task'
            notify_user(user, project_leader, type, task.id, message)

        return Response({
            'message': 'Task submitted successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)        
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_task_status(request, task_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        # get all the tasks assigned to the user
        task = UserTask.objects.get(id=task_id)

        # check if the user is a project leader
        if not task.project.project_leader or task.project.project_leader != user:
            return Response({
                'message': 'You are not authorized to review this task',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        serializer = UpdateUserTaskStatusSerializer(data=request.data, instance=task)

        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        assignee = task.assignee

        if assignee != user:
            message = user.username + " has reviewed your submission of task " + task.name
            type = 'task'
            notify_user(user, assignee, type, task.id, message)

        return Response({
            'message': 'Task status updated successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)        
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_task_rating(request, task_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        # get all the tasks assigned to the user
        task = UserTask.objects.get(id=task_id)

        # check if the user is the project leader or admin of the task
        if not ((task.project.project_leader and task.project.project_leader == user) 
                or user.designations.filter(organization=task.project.organization, role='Admin').exists()):
            return Response({
                'message': 'You are not authorized to rate this task',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        serializer = UpdateUserTaskRatingSerializer(data=request.data, instance=task, context={'user': user})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        assignee = task.assignee

        if assignee != user:
            message = user.username + " has rated your submission of task " + task.name
            type = 'task'
            notify_user(user, assignee, type, task.id, message)

        return Response({
            'message': 'Task rated successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)        
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_notifications(request):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)
        
        notifications = Notification.objects.filter(receiver=user)
        serializer = NotificationSerializer(notifications, many=True)
        return Response({
            'message': 'User notifications fetched successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
    
@database_sync_to_async
def update_notification_status(notifications_data):
    print('update_notification_status')
    for notification_data in notifications_data:
        print("1210", notification_data)
        notification = Notification.objects.get(id=notification_data['id'])
        if(notification_data['status'] == 'read'):
            notification.read = True
        notification.save()
    print('updated notification status')

    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_project_details(request, project_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        # get all the tasks assigned to the user
        project = Project.objects.get(id=project_id)

        # check if the user is the project leader
        if not project.project_leader or project.project_leader != user:
            return Response({
                'message': 'You are not authorized to update this project',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        serializer = UpdateProjectSerializer(data=request.data, instance=project)

        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            'message': 'Project details updated successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)        
        return Response({
            'message': serializer.errors.get('non_field_errors')[0],
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def complete_project(request, project_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        # get all the tasks assigned to the user
        project = Project.objects.get(id=project_id)

        # check if the user is the project leader
        if not project.project_leader or project.project_leader != user:
            return Response({
                'message': 'You are not authorized to update this project',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # check if all tasks of the project are completed or rejected or terminated
        tasks = UserTask.objects.filter(project=project)
        for task in tasks:
            task_status = task.status
            if task_status != 'Completed' and task_status != 'Rejected' and task_status != 'Terminated':
                return Response({
                    'message': 'All tasks of the project are not completed yet',
                    'data': None
                }, status=status.HTTP_400_BAD_REQUEST)
        
        project.end_time = timezone.now()

        project.save()

        serializer = ProjectDetailsSerializer(project, context={'user': user})
        
        return Response({
            'message': 'Project status updated successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)        
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_contributions(request):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)
        
        # get all the end dates of the completed, rejected and submitted tasks of the user
        tasks = UserTask.objects.filter(assignee=user, status__in=['Completed', 'Rejected', 'Submitted']).values('end_time', 'status')

        return Response({
            'message': 'Contributions fetched successfully',
            'data': tasks
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_projects_completed_task_percentage(request):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        # get all the projects led by the user
        projects = Project.objects.filter(project_leader=user, end_time__isnull=True)
        
        data = []
        for project in projects:
            tasks = UserTask.objects.filter(project=project)
            completed_tasks = UserTask.objects.filter(project=project, status='Completed')
            if tasks.count() > 0:
                data.append({
                    'id': project.id,
                    'name': project.name,
                    'client': project.client.name,
                    'deadline': project.deadline,
                    'completed_tasks': completed_tasks.count(),
                    'total_tasks': tasks.count(),
                })
            
        return Response({
            'message': 'Completed task percentage fetched successfully',
            'data': data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(e)        
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user_task(request, task_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        # get all the tasks assigned to the user
        task = UserTask.objects.get(id=task_id)

        # check if the user is a project leader
        if not task.project.project_leader or task.project.project_leader != user:
            return Response({
                'message': 'You are not authorized to delete this task',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        task.delete()
        
        return Response({
            'message': 'Task deleted successfully',
            'data': None
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)        
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_project(request, project_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        # get all the tasks assigned to the user
        project = Project.objects.get(id=project_id)

        # check if the user is admin of the organization
        designation = user.designations.filter(organization=project.organization).first()

        if not designation or designation.role != 'Admin':
            return Response({
                'message': 'You are not authorized to delete this project',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        project.delete()
        
        return Response({
            'message': 'Project deleted successfully',
            'data': None
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)        
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_organization(request, organization_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)
        
        organization = Organization.objects.get(id=organization_id)

        # check if the user is admin of the organization
        designation = user.designations.filter(organization=organization).first()

        if not designation or designation.role != 'Admin':
            return Response({
                'message': 'You are not authorized to delete this organization',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        organization.delete()
        
        return Response({
            'message': 'Organization deleted successfully',
            'data': None
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)        
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_organization_details(request, organization_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        # get the organization of the given id
        organization = Organization.objects.get(id=organization_id)

        if not organization:
            return Response({
                'message': 'Organization not found',
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = OrganizationSerializer(organization, context={'user': user})

        return Response({
            'message': 'Organization details fetched successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(e)        
        return Response({
            'message': 'Something went wrong',
            'data': None
        })
