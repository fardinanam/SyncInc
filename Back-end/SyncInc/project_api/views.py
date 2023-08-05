from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import AccessToken
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
        token = get_token_from_request(request)
        access_token_obj = AccessToken(token)
        username = access_token_obj['username']
        user = User.objects.get(username=username)

        designations = user.designations.all()
        organizations = [designation.organization for designation in designations]
        serializer = OrganizationSerializer(organizations, many=True)

        return Response({
            'message': 'Organizations fetched successfully',
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
        # TODO: use token to get the user
        data = request.data
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
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(e)
        return Response({
            'message': 'Something went wrong',
            'data': None
        }, status=status.HTTP_400_BAD_REQUEST)
    
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
