# SyncInc.
## Architecture
Microservice

- **Front-end**: React
- **Back-end**: django

## API Documentation

## `POST` Login

- **URL**: https://syncinc.com/login
- **URL Params**: None
- **Data Params**: 
  - user_id: string
  - password: string
- **Success Response**:
  - Code: 200
  - Content: 
    - token: string
    - user: object
      - id: int
      - username: string
      - email: string
      - first_name: string
      - last_name: string
      - is_active: boolean
      - is_admin: boolean
      - is_project_leader: boolean
      - is_team_member: boolean
      - last_login: string
      - date_joined: string
- **Error Response**:
  - Code: 400
  - Content: 
    - non_field_errors: string
  - Code: 401
  - Content: 
    - detail: string

## `GET` Logout
- **URL**: https://syncinc.com/logout
- **URL Params**: None
- **Data Params**: None
- **Success Response**:
  - Code: 200
  - Content: None
- **Error Response**:
  - Code: 401
  - Content: 
      - detail: string

# Admin
## `GET` Dashboard Data
- **URL**: https://syncinc.com/admin/{user_id}/dashboard
- **URL Params**: 
  - user_id: string
- **Data Params**:
  - token: string
- **Success Response**:
  - Code: 200
  - Content: 
    - employees: array
    - vendors: array
    - projects: array
- **Error Response**:
  - Code: 401
  - Content: 
    - detail: string

## `GET` Employees
- **URL**: https://syncinc.com/admin/{user_id}/employees
- **URL Params**: 
  - user_id: string
- **Data Params**: 
  - token: string
- **Success Response**:
  - Code: 200
  - Content: 
    - employees: array
- **Error Response**:
  - Code: 401
  - Content: 
      - detail: string

## `GET` Vendors
- **URL**: https://syncinc.com/admin/{user_id}/vendors
- **URL Params**: 
  - user_id: string
- **Data Params**: 
  - token: string
- **Success Response**:
  - Code: 200
  - Content: 
    - vendors: array
- **Error Response**:
  - Code: 401
  - Content: 
    - detail: string

## `GET` Projects
- **URL**: https://syncinc.com/admin/{user_id}/projects
- **URL Params**: 
  - user_id: string
- **Data Params**: 
  - token: string
- **Success Response**:
  - Code: 200
  - Content: 
    - projects: array
- **Error Response**:
  - Code: 401
  - Content: 
    - detail: string

## `GET` Project Tasks
- **URL**: https://syncinc.com/admin/{user_id}/{project_id}/tasks
- **URL Params**: 
  - user_id: string
  - project_id: int
- **Data Params**:
  - token: string
- **Success Response**:
  - Code: 200
  - Content: 
    - tasks: array
- **Error Response**:
  - Code: 401
  - Content: 
    - detail: string

## `POST` Add Employee
- **URL**: https://syncinc.com/admin/{user_id}/add-employee
- **URL Params**: 
  - user_id: string
- **Data Params**: 
  - token: string
  - username: string
  - email: string
  - first_name: string
  - last_name: string
  - phone_number: string
  - is_admin: boolean
  - is_project_leader: boolean
  - is_team_member: boolean
- **Success Response**:
  - Code: 200
  - Content: 
    - employee: object
- **Error Response**:
  - Code: 401
  - Content: 
    - detail: string

## `POST` Add Vendor
- **URL**: https://syncinc.com/admin/{user_id}/add-vendor
- **URL Params**: 
  - user_id: string
- **Data Params**: 
  - token: string
  - name: string
  - email: string
  - phone_number: string
  - address: string
  - tags: array
- **Success Response**:
  - Code: 200
  - Content: 
    - vendor: object
- **Error Response**:
  - Code: 401
  - Content: 
    - detail: string

# Project Leader
## `GET` Dashboard Data
- **URL**: https://syncinc.com/project-leader/{user_id}/dashboard
- **URL Params**: 
  - user_id: string
- **Data Params**:
  - token: string
- **Success Response**:
  - Code: 200
  - Content: 
    - ongoing_projects: int
    - completed_projects: int
- **Error Response**:
  - Code: 401
  - Content: 
    - detail: string

## `GET` Ongoing Projects
- **URL**: https://syncinc.com/{user_id}/ongoing-projects
- **URL Params**: 
  - user_id: string
- **Data Params**:
  - token: string
- **Success Response**:
  - Code: 200
  - Content: 
    - projects: array
- **Error Response**:
  - Code: 401
  - Content: 
    - detail: string

## `GET` Completed Projects
- **URL**: https://syncinc.com/{user_id}/completed-projects
- **URL Params**: 
  - user_id: string
- **Data Params**:
  - token: string
- **Success Response**:
  - Code: 200
  - Content: 
    - projects: array
- **Error Response**:
  - Code: 401
  - Content: 
    - detail: string

## `GET` Project Tasks
- **URL**: https://syncinc.com/{user_id}/{project_id}/tasks
- **URL Params**: 
  - user_id: string
  - project_id: int
- **Data Params**:
  - token: string
- **Success Response**:
  - Code: 200
  - Content: 
    - tasks: array
- **Error Response**:
  - Code: 401
  - Content: 
    - detail: string

## `GET` Employees
- **URL**: https://syncinc.com/{user_id}/employees
- **URL Params**: 
  - user_id: string
- **Data Params**:
  - token: string
- **Success Response**:
  - Code: 200
  - Content: 
    - employees: array
- **Error Response**:
  - Code: 401
  - Content: 
    - detail: string

## `GET` Vendors
- **URL**: https://syncinc.com/{user_id}/vendors
- **URL Params**: 
  - user_id: string
- **Data Params**:
  - token: string
- **Success Response**:
  - Code: 200
  - Content: 
    - vendors: array
- **Error Response**:
  - Code: 401
  - Content: 
    - detail: string

## `POST` Add Project
- **URL**: https://syncinc.com/{user_id}/add-project
- **URL Params**: 
  - user_id: string
- **Data Params**:
  - token: string
  - name: string
  - description: string
  - client_name: string
  - client_email: string
  - client_phone_number: string
- **Success Response**:
  - Code: 200
  - Content: 
    - project: object
- **Error Response**:
  - Code: 401
  - Content: 
    - detail: string

## `POST` Add Task
- **URL**: https://syncinc.com/{user_id}/{project_id}/add-task
- **URL Params**: 
  - user_id: string
  - project_id: int
- **Data Params**:
  - token: string
  - name: string
  - description: string
  - due_date: string
  - assignee: string
  - tags: array
- **Success Response**:
  - Code: 200
  - Content: 
    - task: object
- **Error Response**:
  - Code: 401
  - Content: 
    - detail: string

## `POST` Edit Task
- **URL**: https://syncinc.com/{user_id}/{project_id}/edit-task
- **URL Params**: 
  - user_id: string
  - project_id: int
- **Data Params**:
  - token: string
  - task_id: int
  - name: string
  - description: string
  - due_date: string
  - assignee: string
  - tags: array
- **Success Response**:
  - Code: 200
  - Content: 
    - task: object
- **Error Response**:
  - Code: 401
  - Content: 
    - detail: string

## `DELETE` Delete Task
- **URL**: https://syncinc.com/{user_id}/{project_id}/delete-task
- **URL Params**: 
  - user_id: string
  - project_id: int
- **Data Params**:
  - token: string
  - task_id: int
- **Success Response**:
  - Code: 200
  - Content: 
    - task: object
- **Error Response**:
  - Code: 401
  - Content: 
    - detail: string

## `POST` Assign Task
- **URL**: https://syncinc.com/{user_id}/{task_id}/assign-task
- **URL Params**: 
  - user_id: string
  - task_id: int
- **Data Params**:
  - token: string
  - assignee: string
- **Success Response**:
  - Code: 200
  - Content: 
    - task: object

# Team Member

## `GET` Dashboard Data
- **URL**: https://syncinc.com/team-member/{user_id}/dashboard
- **URL Params**: 
  - user_id: string
- **Data Params**:
  - token: string
- **Success Response**:
  - Code: 200
  - Content: 
    - ongoing_projects: int
    - completed_projects: int
    - ongoing_tasks: int
    - completed_tasks: int
- **Error Response**:
  - Code: 401
  - Content: 
    - detail: string

## `GET` Ongoing Tasks
- **URL**: https://syncinc.com/{user_id}/ongoing-tasks
- **URL Params**: 
- **Data Params**: 
  - token: string
- **Success Response**:
  - Code: 200
  - Content: 
    - tasks: array
- **Error Response**:
    - Code: 401
    - Content: 
      - detail: string

## `GET` Completed Tasks
- **URL**: https://syncinc.com/{user_id}/completed-tasks
- **URL Params**:
  - user_id: string
- **Data Params**: 
  - token: string
- **Success Response**:
  - Code: 200
  - Content: 
    - tasks: array
- **Error Response**:
  - Code: 401
  - Content: 
    - detail: string

## `GET` Current Projects
- **URL**: https://syncinc.com/{user_id}/current-projects
- **URL Params**:
  - user_id: string
- **Data Params**: 
  - token: string
- **Success Response**:
  - Code: 200
  - Content: 
    - projects: array
- **Error Response**:
  - Code: 401
  - Content: 
    - detail: string

## `POST` Submit Task
- **URL**: https://syncinc.com/{user_id}/{task_id}/submit-task/
- **URL Params**:
  - user_id: string
  - task_id: int
- **Data Params**: 
  - token: string
  - file: file
  - description: string
- **Success Response**:
  - Code: 200
  - Content: 
    - task: object
- **Error Response**:
  - Code: 401
  - Content: 
    - detail: string

## `POST` Update Profile
- **URL**: https://syncinc.com/{user_id}/update-profile/
- **URL Params**:
  - user_id: string
- **Data Params**:
  - token: string
  - username: string
  - email: string
  - first_name: string
  - last_name: string
  - phone_number: string
  - tags: array
- **Success Response**:
  - Code: 200
  - Content: 
    - user: object
- **Error Response**:
  - Code: 401
  - Content: 
    - detail: string