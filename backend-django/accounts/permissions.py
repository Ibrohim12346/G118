from rest_framework.permissions import BasePermission

from .models import Profile


def get_profile(user):
    """Profile yaratilmagan bo'lsa ham ishlaydi (eski foydalanuvchilar uchun)."""
    profile = getattr(user, "profile", None)
    if profile is None:
        try:
            profile, _ = Profile.objects.get_or_create(
                user=user,
                defaults={"role": "superadmin" if user.is_superuser else "seller"},
            )
        except Exception:
            return None
    return profile


class HasRole(BasePermission):
    """Permission factory: grants access only to given roles."""

    def __init__(self, *roles):
        self.roles = set(roles)

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        profile = get_profile(user)
        if profile is None:
            return False
        if profile.is_blocked or not user.is_active:
            return False
        return profile.role in self.roles


class IsStaffRole(BasePermission):
    """Any authenticated admin-panel user (superadmin/admin/manager/seller)."""

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        profile = get_profile(user)
        if profile is None:
            return False
        if profile.is_blocked or not user.is_active:
            return False
        return profile.role in {"superadmin", "admin", "manager", "seller"}


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        profile = get_profile(user)
        if profile is None:
            return False
        return profile.role == "superadmin" and not profile.is_blocked


class IsManagerOrAbove(BasePermission):
    """superadmin + admin + manager."""

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        profile = get_profile(user)
        if profile is None:
            return False
        return profile.role in {"superadmin", "admin", "manager"} and not profile.is_blocked


class IsAdminOrAbove(BasePermission):
    """superadmin + admin."""

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        profile = get_profile(user)
        if profile is None:
            return False
        return profile.role in {"superadmin", "admin"} and not profile.is_blocked