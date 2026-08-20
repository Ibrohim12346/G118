from django.urls import path

from .views import (
    ChangePasswordView,
    CsrfTokenView,
    ForgotPasswordView,
    LoginView,
    LogoutView,
    MeView,
    RefreshView,
    RegisterView,
    ResetPasswordView,
    UserDetailView,
    UserListView,
)

urlpatterns = [
    path("csrf/", CsrfTokenView.as_view(), name="auth_csrf"),
    path("login/", LoginView.as_view(), name="auth_login"),
    path("register/", RegisterView.as_view(), name="auth_register"),
    path("logout/", LogoutView.as_view(), name="auth_logout"),
    path("me/", MeView.as_view(), name="auth_me"),
    path("refresh/", RefreshView.as_view(), name="auth_refresh"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="auth_forgot_password"),
    path("reset-password/", ResetPasswordView.as_view(), name="auth_reset_password"),
    path("change-password/", ChangePasswordView.as_view(), name="auth_change_password"),
    path("users/", UserListView.as_view(), name="auth_users"),
    path("users/<int:user_id>/", UserDetailView.as_view(), name="auth_user_detail"),
]