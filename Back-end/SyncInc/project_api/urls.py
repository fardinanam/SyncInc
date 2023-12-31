from django.urls import path
from . import views

urlpatterns = [
    path('create_organization/', views.create_organization, name='create_organization'),
    path('get_organizations/', views.get_organizations, name='get_organizations'),
    path('get_organizations/<int:organization_id>/', views.get_organization, name='get_organization'),
    path('create_project/<int:organization_id>/', views.create_project, name='create_project'),
    path('organization_projects/<int:organization_id>/', views.get_organization_projects, name='organization_projects'),
    path('organization_employees/<int:organization_id>/', views.get_organization_employees, name='organization_employees'),
    path('organization_vendors/<int:organization_id>/', views.get_organization_vendors, name='organization_vendors'),
    path('get_project/<int:project_id>/', views.get_project, name='project_details'),
    path('get_organization_role/<int:organization_id>/', views.get_organization_role, name='organization_role'),

    path('get_employee_suggestions/<int:organization_id>/', views.get_employee_suggestions, name='employee_suggestions'),
    path('get_vendor_suggestions/<int:organization_id>/', views.get_vendor_suggestions, name='vendor_suggestions'),
    path('get_project_leader_suggestions/<int:project_id>/', views.get_project_leader_suggestions, name='project_leder_suggestions'),
    path('invite_employee/<int:organization_id>/', views.invite_employee, name='invite_employee'),
    path('get_invites/', views.get_invites, name='get_invites'),
    path('accept_invite/<int:invitation_id>/', views.accept_invite, name='accept_invite'),
    path('reject_invite/<int:invitation_id>/', views.reject_invite, name='reject_invite'),
    path('add_vendor/<int:organization_id>/', views.add_vendor, name='add_vendor'),

    path('all_tags/', views.get_all_tags, name='all_tags'),
    path('set_user_tags/', views.set_or_create_user_tags, name='set_user_tags'),
    path('create_task/<int:project_id>/', views.create_task, name='create_task'),
    path('user_tasks/<int:project_id>/', views.get_user_tasks, name='user_tasks'),
    path('vendor_tasks/<int:project_id>/', views.get_vendor_tasks, name='vendor_tasks'),
    path('assign_user_task/', views.assign_user_task, name='assign_task'),
    
    path('get_user_items_count/', views.get_user_items_count, name='get_user_items_count'),
    path('assign_project_leader/<int:project_id>/', views.assign_project_leader, name='assign_project_leader'),
    path('get_all_tasks_of_user/', views.get_all_tasks_of_user, name='get_all_tasks_of_user'),
    path('get_user_task/<int:task_id>/', views.get_user_task, name='get_task'),
    path('update_user_task_details/<int:task_id>/', views.update_user_task_details, name='update_task'),
    path('submit_user_task/<int:task_id>/', views.submit_user_task, name='submit_task'),

    path('update_user_task_status/<int:task_id>/', views.update_user_task_status, name='update_task_status'),
    path('update_user_task_rating/<int:task_id>/', views.update_user_task_rating, name='update_task_rating'),

    path('get_user_projects/', views.get_user_projects, name='user_projects'),
    path('get_user_projects_completed_task_percentage/', views.get_user_projects_completed_task_percentage, name='user_projects_completed_task_percentage'),


    path('get_user_notifications/', views.get_user_notifications, name='user_notifications'),
    path('update_project_details/<int:project_id>/', views.update_project_details, name='update_project_details'),
    path('complete_project/<int:project_id>/', views.complete_project, name='complete_project'),
    path('get_user_contributions/', views.get_user_contributions, name='user_contributions'),
    path('delete_user_task/<int:task_id>/', views.delete_user_task, name='delete_task'),
    path('delete_project/<int:project_id>/', views.delete_project, name='delete_project'),
    path('delete_organization/<int:organization_id>/', views.delete_organization, name='delete_organization'),
    path('get_organization_details/<int:organization_id>/', views.get_organization_details, name='get_organization_details'),
]