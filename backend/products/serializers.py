from rest_framework import serializers

from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "description", "created_at"]


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(
        slug_field="name", queryset=Category.objects.all()
    )
    image = serializers.ImageField(read_only=True)
    reviews_count = serializers.IntegerField(read_only=True)
    rating = serializers.FloatField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "title",
            "description",
            "price",
            "wholesale_price",
            "image",
            "image_url",
            "is_wholesale",
            "stock",
            "is_featured",
            "reviews_count",
            "rating",
            "created_at",
        ]