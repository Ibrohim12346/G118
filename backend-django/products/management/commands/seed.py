from django.core.management.base import BaseCommand
from django.db import transaction

from products.models import Category, Product
from reviews.models import Review
from subscribers.models import Subscriber


class Command(BaseCommand):
    help = "Seed the database with sample data matching the frontend."

    @transaction.atomic
    def handle(self, *args, **options):
        categories = [
            "Men's Wear",
            "Women's Wear",
            "Kids' Wear",
            "Shoes",
        ]
        cat_objs = {}
        for name in categories:
            obj, _ = Category.objects.get_or_create(name=name)
            cat_objs[name] = obj

        products = [
            {
                "title": "Premium Jacket",
                "category": "Women's Wear",
                "price": "22.00",
                "wholesale_price": "18.50",
                "image_url": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
                "is_featured": True,
            },
            {
                "title": "Warm Winter Coat",
                "category": "Men's Wear",
                "price": "29.00",
                "wholesale_price": "22.00",
                "image_url": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
                "is_featured": True,
            },
            {
                "title": "Kids Collection",
                "category": "Kids' Wear",
                "price": "19.90",
                "wholesale_price": "15.90",
                "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
                "is_featured": True,
            },
            {
                "title": "Premium Shoes",
                "category": "Shoes",
                "price": "24.99",
                "wholesale_price": "19.99",
                "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
                "is_featured": True,
            },
            {
                "title": "Black & Navy Tailored Blazer",
                "category": "Women's Wear",
                "price": "22.00",
                "wholesale_price": "15.50",
                "image_url": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=80",
                "is_featured": False,
            },
            {
                "title": "Premium White Shirt",
                "category": "Men's Wear",
                "price": "18.00",
                "wholesale_price": "12.90",
                "image_url": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80",
                "is_featured": False,
            },
            {
                "title": "Elegant Red Dress",
                "category": "Women's Wear",
                "price": "25.00",
                "wholesale_price": "18.50",
                "image_url": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80",
                "is_featured": False,
            },
            {
                "title": "Classic Black Sweater",
                "category": "Men's Wear",
                "price": "20.00",
                "wholesale_price": "14.90",
                "image_url": "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=700&q=80",
                "is_featured": False,
            },
        ]

        for p in products:
            Product.objects.update_or_create(
                title=p["title"],
                defaults={
                    "category": cat_objs[p["category"]],
                    "price": p["price"],
                    "wholesale_price": p["wholesale_price"],
                    "image_url": p["image_url"],
                    "is_featured": p["is_featured"],
                    "stock": 50,
                },
            )

        reviews = [
            {
                "name": "Ali Market",
                "text": "Very good quality products. Prices are also suitable for wholesale.",
                "rating": 5,
                "product": "Premium Jacket",
            },
            {
                "name": "Fashion Store",
                "text": "Fast delivery and excellent customer service. Highly recommended.",
                "rating": 5,
                "product": "Warm Winter Coat",
            },
            {
                "name": "Kids Shop",
                "text": "Products arrived safely and quality was better than expected.",
                "rating": 4,
                "product": "Kids Collection",
            },
        ]
        for r in reviews:
            product = Product.objects.filter(title=r["product"]).first()
            review, _ = Review.objects.get_or_create(
                name=r["name"], defaults={**r, "product": product}
            )
            if review.product is None:
                review.product = product
                review.save(update_fields=["product"])

        for email in ["ali@example.com", "fashion@example.com"]:
            Subscriber.objects.get_or_create(email=email)

        self.stdout.write(self.style.SUCCESS("Seed data created successfully."))