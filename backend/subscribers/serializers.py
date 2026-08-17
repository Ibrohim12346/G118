from rest_framework import serializers

from .models import Subscriber


class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ["id", "email", "created_at"]
        read_only_fields = ["created_at"]

    def validate_email(self, value):
        if Subscriber.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already subscribed.")
        return value