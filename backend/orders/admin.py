from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ["price"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "full_name", "phone", "status", "total_price", "created_at"]
    list_filter = ["status"]
    search_fields = ["full_name", "phone", "email"]
    list_editable = ["status"]
    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ["order", "product", "quantity", "price"]
    search_fields = ["order__full_name", "product__title"]