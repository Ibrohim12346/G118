from django.urls import include, path
from rest_framework.routers import DefaultRouter

from accounts.views import AdminStatsView
from orders.views import CustomerListView, OrderViewSet
from products.views import CategoryViewSet, ProductViewSet
from reviews.views import ReviewViewSet
from subscribers.views import SubscriberViewSet

router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="product")
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"reviews", ReviewViewSet, basename="review")
router.register(r"orders", OrderViewSet, basename="order")
router.register(r"subscribers", SubscriberViewSet, basename="subscriber")

urlpatterns = [
    path("auth/", include("accounts.urls")),
    path("admin/stats/", AdminStatsView.as_view(), name="admin_stats"),
    path("admin/customers/", CustomerListView.as_view(), name="admin_customers"),
] + router.urls