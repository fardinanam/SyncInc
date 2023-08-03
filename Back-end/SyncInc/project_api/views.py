from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializer import *

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_organizations(request):
    try:
        # get the organizations
        data = request.data
        user = data.get('username')
        user = User.objects.get(username=user)
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
        data = request.data
        serializer = OrganizationSerializer(data=data)

        if not serializer.is_valid():
            return Response({
                'message': 'Invalid data',
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
