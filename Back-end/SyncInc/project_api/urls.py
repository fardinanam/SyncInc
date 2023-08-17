from django.urls import path
from . import views

urlpatterns = [
    path('create_organization/', views.create_organization, name='create_organization'),
    path('get_organizations/', views.get_organizations, name='get_organizations'),
    path('get_organizations/<int:organization_id>/', views.get_organization, name='get_organization'),
    path('create_project/<int:organization_id>/', views.create_project, name='create_project'),
    path('organization_projects/<int:organization_id>/', views.get_organization_projects, name='organization_projects'),
    path('organization_employees/<int:organization_id>/', views.get_organization_employees, name='organization_members'),
    path('organization_vendors/<int:organization_id>/', views.get_organization_vendors, name='organization_vendors'),
    path('get_project/<int:project_id>/', views.get_project, name='project_details'),

    path('get_member_suggestions/<int:organization_id>/', views.get_member_suggestions, name='member_suggestions'),
    path('add_member/<int:organization_id>/', views.add_member, name='add_member'),
  
    path('all_tags/', views.get_all_tags, name='all_tags'),
    path('set_user_tags/', views.set_or_create_user_tags, name='set_user_tags'),
    path('create_task/<int:project_id>/', views.create_task, name='create_task'),
    path('user_tasks/<int:project_id>/', views.get_user_tasks, name='user_tasks'),
    path('vendor_tasks/<int:project_id>/', views.get_vendor_tasks, name='vendor_tasks'),
    path('assign_user_task/', views.assign_user_task, name='assign_task'),
]