from django.db.models import Avg, Count, Value
from django.db.models.functions import Coalesce
from rest_framework import viewsets

from accounts.permissions import IsAdminOrAbove
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsAdminOrAbove()]
        return []


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsAdminOrAbove()]
        return []

    def get_queryset(self):
        queryset = (
            Product.objects.select_related("category")
            .annotate(
                reviews_count=Count("reviews"),
                rating=Coalesce(Avg("reviews__rating"), Value(5.0)),
            )
            .all()
        )
        category = self.request.query_params.get("category")
        featured = self.request.query_params.get("featured")
        search = self.request.query_params.get("search")
        if category:
            queryset = queryset.filter(category__name__iexact=category)
        if featured:
            queryset = queryset.filter(is_featured=True)
        if search:
            queryset = queryset.filter(title__icontains=search)
        return queryset