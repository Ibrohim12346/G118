from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Subscriber
from .serializers import SubscriberSerializer


class SubscriberViewSet(viewsets.ModelViewSet):
    queryset = Subscriber.objects.all()
    serializer_class = SubscriberSerializer

    def get_permissions(self):
        if self.action == "create":
            return []
        return [IsAuthenticated()]