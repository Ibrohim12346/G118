from django.contrib import admin

from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "created_at"]
    search_fields = ["name"]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "price", "wholesale_price", "stock", "is_featured"]
    list_filter = ["category", "is_wholesale", "is_featured"]
    search_fields = ["title", "description"]
    list_editable = ["price", "stock", "is_featured"]