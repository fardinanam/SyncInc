from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializer import *
from .utils import *

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_organizations(request):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        designations = user.designations.all()
        organizations = [designation.organization for designation in designations]
        serializer = OrganizationSerializer(organizations, many=True)
        print(serializer.data)
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
        serializer = OrganizationSerializer(organization)
        
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
def get_organization_projects(request, organization_id):
    """
        Get organization name and all the projects of the organization
        from the given organization id
    """
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        organization = Organization.objects.get(id=organization_id)
        serializer = OrganizationProjectsSerializer(organization)
        print(serializer.data)

        # check if the user is an admin of the organization
        designation = user.designations.filter(organization=organization).first()
        # for designation in designations:

        if designation and designation.role != 'Admin':
            return Response({
                'message': 'You are not authorized to view this organization',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        return Response({
            'message': f'Projects of the organization {organization.name}',
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
        
        serializer = OrganizationSerializer(data=data)
        print('before validation')
        if not serializer.is_valid():
            print(serializer.errors)
            return Response({
                'message': serializer.errors.get('non_field_errors')[0],
                'data': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        organization = serializer.save()

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
        print(serializer.data)
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
        
        
        employees = User.objects.exclude(designation__organization=organization).values( 'id','username', 'email')

        print(employees)

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
def add_employee(request, organization_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        organization = Organization.objects.get(id=organization_id)
        designation = user.designations.filter(organization=organization).first()

        print(request)

        if designation and designation.role != 'Admin':
            return Response({
                'message': 'You are not authorized to add new employee to this organization',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        data = request.data
        member_id = data['id']
        employee = User.objects.get(id=member_id)
        designation = Designation.objects.create(
            employee=employee,
            organization=organization,
            role='Employee'
        )
        designation.save()
        data = EmployeeSerializer(employee).data

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

        # check if the user is an admin of the organization
        designation = user.designations.filter(organization=project.organization).first()
        
        project_role = ''

        if project.project_leader == user:
            project_role = 'Project Leader'
        elif designation and designation.role == 'Admin':
            project_role = 'Admin'
        else:
            return Response({
                'message': 'You are not authorized to view this project',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = ProjectDetailsSerializer(project)
        serializer.data['project_role'] = project_role

        return Response({
            'message': 'Project details',
            'data': {
                'project': serializer.data, 
                'role': project_role
            }

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
        
        if not designation or not (designation.role == 'Admin' or project.project_leader == user):
            return Response({
                'message': 'You are not authorized to view this project',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        tasks = UserTask.objects.filter(project=project)
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
        
        if not designation or not (designation.role == 'Admin' or project.project_leader == user):
            return Response({
                'message': 'You are not authorized to view this project',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)

        tasks = VendorTask.objects.filter(project=project)
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

        task.assignee = user
        task.save()

        serializer = GetUserTaskSerializer(task)

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
    