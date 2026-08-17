from rest_framework.routers import DefaultRouter

from orders.views import OrderViewSet
from products.views import CategoryViewSet, ProductViewSet
from reviews.views import ReviewViewSet
from subscribers.views import SubscriberViewSet

router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="product")
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"reviews", ReviewViewSet, basename="review")
router.register(r"orders", OrderViewSet, basename="order")
router.register(r"subscribers", SubscriberViewSet, basename="subscriber")

urlpatterns = router.urls