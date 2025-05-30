from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, LogoutView, UserView, UserListView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('user/', UserView.as_view(), name='auth_user'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
