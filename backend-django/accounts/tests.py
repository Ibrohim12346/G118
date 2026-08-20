from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from .models import Profile


class AuthFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username="admin",
            email="admin@example.com",
            password="Testpass123",
        )
        Profile.objects.create(user=self.user, role="superadmin")

    def test_login_sets_cookies(self):
        res = self.client.post(
            "/api/auth/login/",
            {"email": "admin@example.com", "password": "Testpass123"},
        )
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.cookies.get("access_token"))
        self.assertTrue(res.cookies.get("refresh_token"))
        self.assertEqual(res.data["user"]["role"], "superadmin")

    def test_login_wrong_password(self):
        res = self.client.post(
            "/api/auth/login/",
            {"email": "admin@example.com", "password": "wrong"},
        )
        self.assertEqual(res.status_code, 401)

    def test_me_requires_auth(self):
        res = self.client.get("/api/auth/me/")
        self.assertEqual(res.status_code, 401)

    def test_forgot_password_invalid_email(self):
        res = self.client.post(
            "/api/auth/forgot-password/", {"email": "ghost@example.com"}
        )
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.data["success"])

    def test_reset_password_flow(self):
        from datetime import timedelta

        from django.utils import timezone

        from .models import PasswordResetToken

        token = PasswordResetToken.objects.create(
            user=self.user,
            token="sometoken123",
            expires_at=timezone.now() + timedelta(hours=1),
        )
        res = self.client.post(
            "/api/auth/reset-password/",
            {
                "token": token.token,
                "password": "Newpass123",
                "confirm_password": "Newpass123",
            },
        )
        self.assertEqual(res.status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("Newpass123"))

    def test_change_password(self):
        login = self.client.post(
            "/api/auth/login/",
            {"email": "admin@example.com", "password": "Testpass123"},
        )
        self.assertEqual(login.status_code, 200)
        self.client.credentials(HTTP_COOKIE=f"access_token={login.cookies['access_token'].value}")
        res = self.client.post(
            "/api/auth/change-password/",
            {
                "current_password": "Testpass123",
                "new_password": "Brandnew123",
                "confirm_password": "Brandnew123",
            },
        )
        self.assertEqual(res.status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("Brandnew123"))