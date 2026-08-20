from rest_framework import serializers

from products.models import Product

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source="product.title", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_title", "quantity", "price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "full_name",
            "phone",
            "email",
            "address",
            "note",
            "status",
            "total_price",
            "items",
            "created_at",
        ]
        read_only_fields = ["total_price", "created_at"]

    def validate_status(self, value):
        allowed = [choice[0] for choice in Order.STATUS_CHOICES]
        if value not in allowed:
            raise serializers.ValidationError("Noto'g'ri buyurtma statusi.")
        return value

    def create(self, validated_data):
        items = self.context["request"].data.get("items", [])
        order = Order.objects.create(**validated_data)
        total = 0
        for item in items:
            product = Product.objects.filter(pk=item.get("product")).first()
            if product is None:
                continue
            quantity = item.get("quantity", 1)
            price = product.wholesale_price or product.price
            OrderItem.objects.create(
                order=order, product=product, quantity=quantity, price=price
            )
            total += price * quantity
        order.total_price = total
        order.save(update_fields=["total_price"])
        return order