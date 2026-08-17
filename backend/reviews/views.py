from rest_framework import viewsets

from .models import Review
from .serializers import ReviewSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        product = self.request.query_params.get("product")
        if product:
            queryset = queryset.filter(product_id=product)
        return queryset