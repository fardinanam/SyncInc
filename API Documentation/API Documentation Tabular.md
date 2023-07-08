# SyncInc.
## Architecture
**Microservice Architecture**

- **Front-end**: React
- **Back-end**: django

## API Documentation

| API Endpoint                                        | HTTP Method | Request Body                                                               | Response Code | Response Body |
| --------------------------------------------------- | ------------| -------------------------------------------------------------------------- | --------------| --------------|
| `POST` Login                                       |             |                                                                           |               |               |
| [https://syncinc.com/login](https://syncinc.com/login) | POST        | { "username": "string", "password": "string" }                              | 200           | { "token": "string" } |
|                                                    |             |                                                                           |               |               |
| `GET` Logout                                      |             |                                                                           |               |               |
| [https://syncinc.com/logout](https://syncinc.com/logout) | GET         |                                                                           | 200           | None          |
|                                                    |             |                                                                           |               |               |
| Admin                                              |             |                                                                           |               |               |
|                                                    |             |                                                                           |               |               |
| `GET` Dashboard Data                               |             |                                                                           |               |               |
| [https://syncinc.com/admin/{user_id}/dashboard](https://syncinc.com/admin/{user_id}/dashboard)       | GET         | { "token": "string" }                                                      | 200           | { "employees": [], "vendors": [], "projects": [] } |
|                                                    |             |                                                                           |               |               |
| `GET` Employees                                    |             |                                                                           |               |               |
| [https://syncinc.com/admin/{user_id}/employees](https://syncinc.com/admin/{user_id}/employees)       | GET         | { "token": "string" }                                                      | 200           | { "employees": [] } |
|                                                    |             |                                                                           |               |               |
| `GET` Vendors                                      |             |                                                                           |               |               |
| [https://syncinc.com/admin/{user_id}/vendors](https://syncinc.com/admin/{user_id}/vendors)         | GET         | { "token": "string" }                                                      | 200           | { "vendors": [] } |
|                                                    |             |                                                                           |               |               |
| `GET` Projects                                     |             |                                                                           |               |               |
| [https://syncinc.com/admin/{user_id}/projects](https://syncinc.com/admin/{user_id}/projects)        | GET         | { "token": "string" }                                                      | 200           | { "projects": [] } |
|                                                    |             |                                                                           |               |               |
| `GET` Project Tasks                                |             |                                                                           |               |               |
| [https://syncinc.com/admin/{user_id}/{project_id}/tasks](https://syncinc.com/admin/{user_id}/{project_id}/tasks) | GET     | { "token": "string" }                                                      | 200           | { "tasks": [] } |
|                                                    |             |                                                                           |               |               |
| `POST` Add Employee                                |             |                                                                           |               |               |
| [https://syncinc.com/admin/{user_id}/add-employee](https://syncinc.com/admin/{user_id}/add-employee)   | POST        | { "token": "string", "username": "string", "email": "string", "first_name": "string", "last_name": "string", "phone_number": "string", "is_admin": true, "is_project_leader": true, "is_team_member": true } | 200           | { "employee": {} } |
|                                                    |             |                                                                           |               |               |
| `POST` Add Vendor                                  |             |                                                                           |               |               |
| [https://syncinc.com/admin/{user_id}/add-vendor](https://syncinc.com/admin/{user_id}/add-vendor)      | POST        | { "token": "string", "name": "string", "email": "string", "phone_number": "string", "address": "string", "tags": [] } | 200           | { "vendor": {} } |
|                                                    |             |                                                                           |               |               |
| Project Leader                                     |             |                                                                           |               |               |
|                                                    |             |                                                                           |               |               |
| `GET` Dashboard Data                               |             |                                                                           |               |               |
| [https://syncinc.com/project-leader/{user_id}/dashboard](https://syncinc.com/project-leader/{user_id}/dashboard) | GET       | { "token": "string" }                                                      | 200           | { "ongoing_projects": 0, "completed_projects": 0 } |
|                                                    |             |                                                                           |               |               |
| `GET` Ongoing Projects                             |             |                                                                           |               |               |
| [https://syncinc.com/{user_id}/ongoing-projects](https://syncinc.com/{user_id}/ongoing-projects)       | GET         | { "token": "string" }                                                      | 200           | { "projects": [] } |
|                                                    |             |                                                                           |               |               |
| `GET` Completed Projects                           |             |                                                                           |               |               |
| [https://syncinc.com/{user_id}/completed-projects](https://syncinc.com/{user_id}/completed-projects)   | GET         | { "token": "string" }                                                      | 200           | { "projects": [] } |
|                                                    |             |                                                                           |               |               |
| `GET` Project Tasks                                |             |                                                                           |               |               |
| [https://syncinc.com/{user_id}/{project_id}/tasks](https://syncinc.com/{user_id}/{project_id}/tasks) | GET         | { "token": "string" }                                                      | 200           | { "tasks": [] } |
|                                                    |             |                                                                           |               |               |
| `GET` Employees                                    |             |                                                                           |               |               |
| [https://syncinc.com/{user_id}/employees](https://syncinc.com/{user_id}/employees)              | GET         | { "token": "string" }                                                      | 200           | { "employees": [] } |
|                                                    |             |                                                                           |               |               |
| `GET` Vendors                                      |             |                                                                           |               |               |
| [https://syncinc.com/{user_id}/vendors](https://syncinc.com/{user_id}/vendors)                    | GET         | { "token": "string" }                                                      | 200           | { "vendors": [] } |
|                                                    |             |                                                                           |               |               |
| `POST` Add Project                                 |             |                                                                           |               |               |
| [https://syncinc.com/{user_id}/add-project](https://syncinc.com/{user_id}/add-project)            | POST        | { "token": "string", "name": "string", "description": "string", "client_name": "string", "client_email": "string", "client_phone_number": "string" } | 200           | { "project": {} } |
|                                                    |             |                                                                           |               |               |
| `POST` Add Task                                    |             |                                                                           |               |               |
| [https://syncinc.com/{user_id}/{project_id}/add-task](https://syncinc.com/{user_id}/{project_id}/add-task)   | POST        | { "token": "string", "name": "string", "description": "string", "due_date": "string", "assignee": "string", "tags": [] } | 200           | { "task": {} } |
|                                                    |             |                                                                           |               |               |
| `POST` Edit Task                                   |             |                                                                           |               |               |
| [https://syncinc.com/{user_id}/{project_id}/edit-task](https://syncinc.com/{user_id}/{project_id}/edit-task)  | POST        | { "token": "string", "task_id": integer, "name": "string", "description": "string", "due_date": "string", "assignee": "string", "tags": [] } | 200           | { "task": {} } |
|                                                    |             |                                                                           |               |               |
| `DELETE` Delete Task                               |             |                                                                           |               |               |
| [https://syncinc.com/{user_id}/{project_id}/delete-task](https://syncinc.com/{user_id}/{project_id}/delete-task) | DELETE     | { "token": "string", "task_id": integer }                                  | 200           | { "task": {} } |
|                                                    |             |                                                                           |               |               |
| `POST` Assign Task                                 |             |                                                                           |               |               |
| [https://syncinc.com/{user_id}/{task_id}/assign-task](https://syncinc.com/{user_id}/{task_id}/assign-task)   | POST        | { "token": "string", "assignee": "string" }                                | 200           | { "task": {} } |
|                                                    |             |                                                                           |               |               |
| Team Member                                        |             |                                                                           |               |               |
|                                                    |             |                                                                           |               |               |
| `GET` Dashboard Data                               |             |                                                                           |               |               |
| [https://syncinc.com/team-member/{user_id}/dashboard](https://syncinc.com/team-member/{user_id}/dashboard) | GET       | { "token": "string" }                                                      | 200           | { "ongoing_projects": 0, "completed_projects": 0, "ongoing_tasks": 0, "completed_tasks": 0 } |
|                                                    |             |                                                                           |               |               |
| `GET` Ongoing Tasks                                |             |                                                                           |               |               |
| [https://syncinc.com/{user_id}/ongoing-tasks](https://syncinc.com/{user_id}/ongoing-tasks)       | GET         | { "token": "string" }                                                      | 200           | { "tasks": [] } |
|                                                    |             |                                                                           |               |               |
| `GET` Completed Tasks                              |             |                                                                           |               |               |
| [https://syncinc.com/{user_id}/completed-tasks](https://syncinc.com/{user_id}/completed-tasks)   | GET         | { "token": "string" }                                                      | 200           | { "tasks": [] } |
|                                                    |             |                                                                           |               |               |
| `GET` Current Projects                             |             |                                                                           |               |               |
| [https://syncinc.com/{user_id}/current-projects](https://syncinc.com/{user_id}/current-projects) | GET         | { "token": "string" }                                                      | 200           | { "projects": [] } |
|                                                    |             |                                                                           |               |               |
| `POST` Submit Task                                 |             |                                                                           |               |               |
| [https://syncinc.com/{user_id}/{task_id}/submit-task/](https://syncinc.com/{user_id}/{task_id}/submit-task/) | POST   | { "token": "string", "file": "file", "description": "string" }              | 200           | { "task": {} } |
|                                                    |             |                                                                           |               |               |
| `POST` Update Profile                              |             |                                                                           |               |               |
| [https://syncinc.com/{user_id}/update-profile/](https://syncinc.com/{user_id}/update-profile/) | POST       | { "token": "string", "username": "string", "email": "string", "first_name": "string", "last_name": "string", "phone_number": "string", "tags": [] } | 200           | { "user": {} } |
|                                                    |             |                                                                           |               |               |

