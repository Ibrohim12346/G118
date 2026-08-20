from datetime import timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone

ROLE_CHOICES = [
    ("superadmin", "Super Admin"),
    ("admin", "Admin"),
    ("manager", "Manager"),
    ("seller", "Seller"),
]

ROLE_LABELS = dict(ROLE_CHOICES)

LOGIN_MAX_ATTEMPTS = 5
LOGIN_LOCK_MINUTES = 15


class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="seller")
    is_blocked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} ({self.role})"


class LoginAttempt(models.Model):
    """Brute-force protection: failed login tracking per identifier + IP."""

    email = models.CharField(max_length=255, db_index=True)
    ip = models.GenericIPAddressField(null=True, blank=True, db_index=True)
    attempts = models.PositiveIntegerField(default=0)
    last_attempt = models.DateTimeField(auto_now=True)
    locked_until = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("email", "ip")

    @classmethod
    def is_locked(cls, email, ip):
        attempt = cls.objects.filter(email=email, ip=ip).first()
        if not attempt or not attempt.locked_until:
            return False
        return attempt.locked_until > timezone.now()

    @classmethod
    def register_failure(cls, email, ip, max_attempts=5, lock_minutes=15):
        attempt, _ = cls.objects.get_or_create(email=email, ip=ip)
        attempt.attempts += 1
        if attempt.attempts >= max_attempts:
            attempt.locked_until = timezone.now() + timedelta(minutes=lock_minutes)
            attempt.attempts = 0
        attempt.save()
        return attempt

    @classmethod
    def clear(cls, email, ip):
        cls.objects.filter(email=email, ip=ip).delete()


class PasswordResetToken(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reset_tokens"
    )
    token = models.CharField(max_length=64, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)

    @property
    def is_valid(self):
        return (
            self.used_at is None
            and self.expires_at > timezone.now()
            and self.user.is_active
        )

    def __str__(self):
        return f"Reset for {self.user.email}"

    class Meta:
        ordering = ["-created_at"]