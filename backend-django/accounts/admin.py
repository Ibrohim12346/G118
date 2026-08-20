from django.contrib import admin

from .models import LoginAttempt, PasswordResetToken, Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role", "is_blocked", "created_at")
    list_filter = ("role", "is_blocked")
    search_fields = ("user__email", "user__username")


@admin.register(LoginAttempt)
class LoginAttemptAdmin(admin.ModelAdmin):
    list_display = ("email", "ip", "attempts", "locked_until", "last_attempt")
    search_fields = ("email", "ip")


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ("user", "created_at", "expires_at", "used_at")
    search_fields = ("user__email",)