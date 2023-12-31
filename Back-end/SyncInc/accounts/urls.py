from django.urls import path
from . import views
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(),
    name='token_refresh'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('verify-email/<str:email_token>/', views.VerifyEmailView.as_view(), name='verify-email'),
    path('profile_info/', views.ProfileInfoView.as_view(), name='profile_info'),
    path('profile_info/update_profile_pic/', views.UpdateProfilePicView.as_view(), name='update_profile_pic'),
    path('profile_info/update_personal_info/', views.UpdatePersonalInfoView.as_view(), name='update_personal_info'),
    path('profile_info/update_address/', views.UpdateUserAddressView.as_view(), name='update_address'),
    path('profile_info/update_password/', views.UpdatePasswordView.as_view(), name='update_password'),
    path('forgot_password/', views.ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset_password/', views.ResetPasswordView.as_view(), name='reset_password'),
]
