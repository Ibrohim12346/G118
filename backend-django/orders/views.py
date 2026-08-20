from django.db.models import Count, Max, Sum
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsAdminOrAbove, IsManagerOrAbove, IsStaffRole
from .models import Order
from .serializers import OrderSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.prefetch_related("items__product").all()
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.action == "create":
            return []
        if self.action == "destroy":
            return [IsAdminOrAbove()]
        return [IsStaffRole()]

    def get_queryset(self):
        queryset = super().get_queryset()
        phone = self.request.query_params.get("phone")
        status_filter = self.request.query_params.get("status")
        if phone:
            queryset = queryset.filter(phone=phone)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset


class CustomerListView(APIView):
    """Mijozlar — buyurtmalardan agregatsiya qilingan ro'yxat."""

    permission_classes = [IsManagerOrAbove]

    def get(self, request):
        search = request.query_params.get("search", "").strip()

        rows = (
            Order.objects.exclude(phone="")
            .values("phone")
            .annotate(
                order_count=Count("id"),
                total_spent=Sum("total_price"),
                last_order=Max("created_at"),
            )
            .order_by("-last_order")
        )

        customers = []
        for row in rows:
            phone = row["phone"]
            latest = (
                Order.objects.filter(phone=phone)
                .order_by("-created_at")
                .first()
            )
            if latest is None:
                continue
            email = latest.email or ""
            name = latest.full_name or ""
            if search and search.lower() not in (
                name.lower()
                + phone.lower()
                + email.lower()
            ):
                continue
            customers.append(
                {
                    "id": f"c{row['phone']}",
                    "name": name,
                    "phone": phone,
                    "email": email,
                    "order_count": row["order_count"],
                    "total_spent": row["total_spent"] or 0,
                    "last_order": row["last_order"],
                }
            )

        customers.sort(key=lambda c: c["last_order"] or "", reverse=True)
        return Response({"success": True, "customers": customers})