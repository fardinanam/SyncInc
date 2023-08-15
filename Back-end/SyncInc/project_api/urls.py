from django.urls import path
from . import views

urlpatterns = [
    path('create_organization/', views.create_organization, name='create_organization'),
    path('get_organizations/', views.get_organizations, name='get_organizations'),
    path('get_organizations/<int:organization_id>/', views.get_organization, name='get_organization'),
    path('create_project/<int:organization_id>/', views.create_project, name='create_project'),
    path('organization_projects/<int:organization_id>/', views.get_organization_projects, name='organization_projects'),
    path('organization_members/<int:organization_id>/', views.get_organization_members, name='organization_members'),
    path('get_project/<int:project_id>/', views.get_project, name='project_details'),
    # path('invite_member/<int:organization_id>/', views.invite_member, name='invite_member'),
    path('all_tags/', views.get_all_tags, name='all_tags'),
    path('set_user_tags/', views.set_or_create_user_tags, name='set_user_tags'),
    path('create_task/<int:project_id>/', views.create_task, name='create_task'),
]