from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Order
from .serializers import OrderSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.prefetch_related("items__product").all()
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.action == "create":
            return []
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = super().get_queryset()
        phone = self.request.query_params.get("phone")
        if phone:
            queryset = queryset.filter(phone=phone)
        return queryset