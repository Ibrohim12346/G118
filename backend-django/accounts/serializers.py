from rest_framework import serializers

from .models import ROLE_LABELS


class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    username = serializers.CharField(read_only=True)
    role = serializers.CharField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    is_blocked = serializers.BooleanField(read_only=True)
    date_joined = serializers.DateTimeField(read_only=True)

    @staticmethod
    def from_user(user):
        profile = getattr(user, "profile", None)
        return {
            "id": user.id,
            "name": user.get_full_name() or user.username,
            "email": user.email,
            "username": user.username,
            "role": profile.role if profile else "seller",
            "role_label": ROLE_LABELS.get(profile.role if profile else "seller", ""),
            "is_superuser": user.is_superuser,
            "is_active": user.is_active,
            "is_blocked": profile.is_blocked if profile else False,
            "date_joined": user.date_joined,
        }