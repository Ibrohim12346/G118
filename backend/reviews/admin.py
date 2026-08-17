from django.contrib import admin

from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ["name", "product", "rating", "is_verified", "created_at"]
    list_filter = ["rating", "is_verified"]
    search_fields = ["name", "text"]
    list_editable = ["is_verified"]