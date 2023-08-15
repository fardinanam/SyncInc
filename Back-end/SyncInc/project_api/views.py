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
def get_organization_members(request, organization_id):
    """
        Get organization name and all the projects of the organization
        from the given organization id
    """
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        organization = Organization.objects.get(id=organization_id)
        serializer = OrganizationMembersSerializer(organization)
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
        
        data = request.data
        data['username'] = username
        #client only has client name, not its id
        organization = Organization.objects.get(id=organization_id)
        client, created = Client.objects.get_or_create(
            organization=organization,
            name=data['client']
        )
        data['client'] = client.id
        serializer = ProjectSerializer(data=data)
        
        if not serializer.is_valid():
            print("x",serializer.errors)
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
        
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def invite_member(request, organization_id):
    
    
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def create_project(request):
#     try:
#         # process the project data
#         data = request.data
#         serializer = ProjectSerializer(data=data)

#         if not serializer.is_valid():
#             return Response({
#                 'message': 'Invalid data',
#                 'data': serializer.errors
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         project = serializer.save()

#         return Response({
#             'message': 'Project created successfully',
#             'data': serializer.data
#         }, status=status.HTTP_200_OK)

#     except Exception as e:
#         print(e)
#         return Response({
#             'message': 'Something went wrong',
#             'data': None
#         }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_project(request, project_id):
    try:
        username = get_data_from_token(request, 'username')
        user = User.objects.get(username=username)

        project = Project.objects.get(id=project_id)
        
        if project.project_leader != user:
            return Response({
                'message': 'You are not authorized to view this project',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = ProjectDetailsSerializer(project)

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
        