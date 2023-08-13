from django.urls import path
from . import views

urlpatterns = [
    path('create_organization/', views.create_organization, name='create_organization'),
    path('get_organizations/', views.get_organizations, name='get_organizations'),
    path('get_organizations/<int:organization_id>/', views.get_organization, name='get_organization'),
    path('create_project/<int:organization_id>/', views.create_project, name='create_project'),
    path('organization_projects/<int:organization_id>/', views.get_organization_projects, name='organization_projects'),
    path('organization_members/<int:organization_id>/', views.get_organization_members, name='organization_members'),
]