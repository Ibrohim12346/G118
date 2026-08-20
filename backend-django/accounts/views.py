import logging
import secrets
from datetime import timedelta

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import update_last_login
from django.contrib.sessions.models import Session
from django.core.mail import send_mail
from django.db.models import Q
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import (
    BlacklistedToken,
    OutstandingToken,
)

from .models import (
    LOGIN_LOCK_MINUTES,
    LOGIN_MAX_ATTEMPTS,
    LoginAttempt,
    PasswordResetToken,
    Profile,
)
from .permissions import IsAdminOrAbove, IsSuperAdmin
from .serializers import UserSerializer
from orders.serializers import OrderSerializer

logger = logging.getLogger(__name__)

User = get_user_model()

ACCESS_MAX_AGE = int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds())
REFRESH_MAX_AGE = int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds())


def client_ip(request):
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    if xff:
        return xff.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def set_auth_cookies(response, access, refresh):
    secure = not settings.DEBUG
    samesite = "None" if secure else "Lax"
    response.set_cookie(
        "access_token",
        access,
        max_age=ACCESS_MAX_AGE,
        httponly=True,
        secure=secure,
        samesite=samesite,
        path="/",
    )
    response.set_cookie(
        "refresh_token",
        refresh,
        max_age=REFRESH_MAX_AGE,
        httponly=True,
        secure=secure,
        samesite=samesite,
        path="/",
    )
    return response


def clear_auth_cookies(response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return response


def blacklist_refresh_token(raw_token):
    try:
        RefreshToken(raw_token).blacklist()
    except Exception:
        logger.warning("Could not blacklist refresh token")


def invalidate_user_tokens(user):
    """Blacklist every outstanding refresh token and kill all sessions."""
    for token in OutstandingToken.objects.filter(user=user):
        try:
            BlacklistedToken.objects.get_or_create(token=token)
        except Exception:
            logger.warning("Could not blacklist token %s", token.jti)
    for session in Session.objects.all():
        try:
            if str(session.get_decoded().get("_auth_user_id", "")) == str(user.pk):
                session.delete()
        except Exception:
            continue


def user_response(user, message, extra=None):
    data = {
        "success": True,
        "user": UserSerializer.from_user(user),
        "message": message,
    }
    if extra:
        data.update(extra)
    return data


class AuthError(Exception):
    def __init__(self, message, code, http_status):
        super().__init__(message)
        self.message = message
        self.code = code
        self.http_status = http_status


def error_response(message, code, http_status):
    return Response(
        {"success": False, "code": code, "message": message},
        status=http_status,
    )


def _login_user(request, identifier, password):
    if LoginAttempt.is_locked(identifier, client_ip(request)):
        raise AuthError(
            "Hisobingiz vaqtincha bloklangan. Birozdan so'ng qayta urinib ko'ring.",
            "account_locked",
            status.HTTP_429_TOO_MANY_REQUESTS,
        )

    lookup = {"email__iexact": identifier}
    user = User.objects.filter(**lookup).first()
    if user is None:
        user = User.objects.filter(username=identifier).first()

    if user is None:
        raise AuthError(
            "Email yoki parol noto'g'ri.",
            "invalid_credentials",
            status.HTTP_401_UNAUTHORIZED,
        )

    profile = getattr(user, "profile", None)
    if profile and profile.is_blocked:
        raise AuthError(
            "Hisobingiz vaqtincha bloklangan.",
            "account_blocked",
            status.HTTP_403_FORBIDDEN,
        )
    if not user.is_active:
        raise AuthError(
            "Hisobingiz faol emas. Administrator bilan bog'laning.",
            "account_inactive",
            status.HTTP_403_FORBIDDEN,
        )

    auth_user = authenticate(request, username=user.username, password=password)
    if auth_user is None:
        LoginAttempt.register_failure(
            identifier, client_ip(request), LOGIN_MAX_ATTEMPTS, LOGIN_LOCK_MINUTES
        )
        raise AuthError(
            "Email yoki parol noto'g'ri.",
            "invalid_credentials",
            status.HTTP_401_UNAUTHORIZED,
        )

    LoginAttempt.clear(identifier, client_ip(request))
    update_last_login(None, auth_user)
    return auth_user


class CsrfTokenView(APIView):
    """Sets the CSRF cookie and returns the token for the SPA."""

    permission_classes = [AllowAny]

    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        from django.middleware.csrf import get_token

        return Response(
            {
                "success": True,
                "csrfToken": get_token(request),
                "message": "CSRF token ready",
            }
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(csrf_protect)
    def post(self, request):
        identifier = (request.data.get("email") or request.data.get("username") or "").strip()
        password = request.data.get("password") or ""

        if not identifier or not password:
            return error_response(
                "Email va parolni kiriting.",
                "validation_error",
                status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = _login_user(request, identifier, password)
        except AuthError as err:
            return error_response(err.message, err.code, err.http_status)

        refresh = RefreshToken.for_user(user)
        response = Response(
            user_response(
                user,
                "Login successful",
                {"access": str(refresh.access_token), "refresh": str(refresh)},
            ),
            status=status.HTTP_200_OK,
        )
        set_auth_cookies(response, str(refresh.access_token), str(refresh))
        return response


class RegisterView(APIView):
    permission_classes = [IsSuperAdmin]

    @method_decorator(csrf_protect)
    def post(self, request):
        email = (request.data.get("email") or "").strip().lower()
        password = request.data.get("password") or ""
        role = (request.data.get("role") or "seller").strip()
        full_name = (request.data.get("name") or request.data.get("full_name") or "").strip()

        if not email or not password:
            return error_response(
                "Email va parol majburiy.",
                "validation_error",
                status.HTTP_400_BAD_REQUEST,
            )
        if len(password) < 8:
            return error_response(
                "Parol kamida 8 ta belgidan iborat bo'lishi kerak.",
                "validation_error",
                status.HTTP_400_BAD_REQUEST,
            )
        if User.objects.filter(email__iexact=email).exists():
            return error_response(
                "Bu email allaqachon band.",
                "email_exists",
                status.HTTP_400_BAD_REQUEST,
            )

        username = email.split("@")[0]
        base = username
        i = 1
        while User.objects.filter(username=username).exists():
            username = f"{base}{i}"
            i += 1

        parts = full_name.split(" ", 1)
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=parts[0] if parts else "",
            last_name=parts[1] if len(parts) > 1 else "",
        )
        profile = Profile.objects.get(user=user)
        profile.role = role
        profile.save(update_fields=["role"])

        return Response(
            user_response(user, "Foydalanuvchi muvaffaqiyatli yaratildi."),
            status=status.HTTP_201_CREATED,
        )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(user_response(request.user, "Authenticated"))


class RefreshView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(csrf_protect)
    def post(self, request):
        raw_refresh = request.COOKIES.get("refresh_token") or request.data.get("refresh")
        if not raw_refresh:
            return error_response(
                "Refresh token topilmadi.",
                "refresh_missing",
                status.HTTP_401_UNAUTHORIZED,
            )

        try:
            refresh = RefreshToken(raw_refresh)
            refresh.check_blacklist()
            user = User.objects.filter(pk=refresh["user_id"]).first()
            if user is None or not user.is_active:
                raise TokenError("inactive user")
            profile = getattr(user, "profile", None)
            if profile and profile.is_blocked:
                raise TokenError("blocked user")

            new_refresh = None
            if settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS"):
                refresh.blacklist()
                new_refresh = str(RefreshToken.for_user(user))
            access = str(refresh.access_token)
        except TokenError:
            return error_response(
                "Sessiya muddati tugagan. Qayta kiring.",
                "invalid_refresh",
                status.HTTP_401_UNAUTHORIZED,
            )

        response = Response(
            {
                "success": True,
                "message": "Token yangilandi",
                "access": access,
                "refresh": new_refresh,
            }
        )
        set_auth_cookies(response, access, new_refresh or raw_refresh)
        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    @method_decorator(csrf_protect)
    def post(self, request):
        raw_refresh = request.COOKIES.get("refresh_token") or request.data.get("refresh")
        if raw_refresh:
            blacklist_refresh_token(raw_refresh)
        response = Response(
            {"success": True, "message": "Tizimdan chiqildi"},
            status=status.HTTP_200_OK,
        )
        clear_auth_cookies(response)
        return response


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(csrf_protect)
    def post(self, request):
        email = (request.data.get("email") or "").strip().lower()
        if not email:
            return error_response(
                "Emailni kiriting.", "validation_error", status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.filter(email__iexact=email).first()
        extra = {}
        if user and user.is_active:
            token = secrets.token_urlsafe(32)
            PasswordResetToken.objects.filter(user=user).delete()
            PasswordResetToken.objects.create(
                user=user,
                token=token,
                expires_at=timezone.now() + timedelta(hours=1),
            )

            reset_url = f"{settings.FRONTEND_URL}/admin/reset-password/{token}"
            try:
                send_mail(
                    subject="ODEGA Admin Panel — Parolni tiklash",
                    message=(
                        "Salom!\n\n"
                        "Parolingizni tiklash uchun quyidagi havolani oching:\n"
                        f"{reset_url}\n\n"
                        "Bu havola 1 soat davomida amal qiladi.\n"
                        "Agar siz bu so'rovni yubormagan bo'lsangiz, xatni e'tiborsiz qoldiring.\n\n"
                        "ODEGA Admin Panel"
                    ),
                    from_email=None,
                    recipient_list=[user.email],
                    fail_silently=True,
                )
            except Exception as exc:
                logger.warning("Reset email failed to send: %s", exc)

            if settings.DEBUG:
                extra["debug_reset_url"] = reset_url

        return Response(
            {
                "success": True,
                "message": (
                    "Agar bu email tizimda ro'yxatdan o'tgan bo'lsa, "
                    "parolni tiklash havolasi yuborildi."
                ),
                **extra,
            },
            status=status.HTTP_200_OK,
        )


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(csrf_protect)
    def post(self, request):
        token = (request.data.get("token") or "").strip()
        password = request.data.get("password") or ""
        confirm = request.data.get("confirm_password") or ""

        if not token:
            return error_response(
                "Token topilmadi.", "validation_error", status.HTTP_400_BAD_REQUEST
            )
        if len(password) < 8:
            return error_response(
                "Parol kamida 8 ta belgidan iborat bo'lishi kerak.",
                "validation_error",
                status.HTTP_400_BAD_REQUEST,
            )
        if password != confirm:
            return error_response(
                "Parollar bir-biriga mos emas.",
                "validation_error",
                status.HTTP_400_BAD_REQUEST,
            )

        reset = PasswordResetToken.objects.filter(token=token).first()
        if reset is None or not reset.is_valid:
            return error_response(
                "Bu havola yaroqsiz yoki muddati o'tgan. Qayta so'rov yuboring.",
                "invalid_token",
                status.HTTP_400_BAD_REQUEST,
            )

        reset.user.set_password(password)
        reset.user.save(update_fields=["password"])
        reset.used_at = timezone.now()
        reset.save(update_fields=["used_at"])
        invalidate_user_tokens(reset.user)

        return Response(
            {
                "success": True,
                "message": "Parolingiz muvaffaqiyatli o'zgartirildi.",
            },
            status=status.HTTP_200_OK,
        )


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    @method_decorator(csrf_protect)
    def post(self, request):
        current = request.data.get("current_password") or ""
        new_password = request.data.get("new_password") or ""
        confirm = request.data.get("confirm_password") or ""

        if not request.user.check_password(current):
            return error_response(
                "Joriy parol noto'g'ri.",
                "wrong_current_password",
                status.HTTP_400_BAD_REQUEST,
            )
        if len(new_password) < 8:
            return error_response(
                "Yangi parol kamida 8 ta belgidan iborat bo'lishi kerak.",
                "validation_error",
                status.HTTP_400_BAD_REQUEST,
            )
        if new_password != confirm:
            return error_response(
                "Parollar bir-biriga mos emas.",
                "validation_error",
                status.HTTP_400_BAD_REQUEST,
            )

        request.user.set_password(new_password)
        request.user.save(update_fields=["password"])
        invalidate_user_tokens(request.user)

        response = Response(
            {
                "success": True,
                "message": "Parol muvaffaqiyatli o'zgartirildi. Qayta kirishingiz kerak.",
            }
        )
        clear_auth_cookies(response)
        return response


class UserListView(APIView):
    """Superadmin: admin panel foydalanuvchilarini boshqarish."""

    permission_classes = [IsSuperAdmin]

    def get(self, request):
        from .models import Profile

        profiles = Profile.objects.select_related("user").order_by("-created_at")
        role = request.query_params.get("role")
        if role:
            profiles = profiles.filter(role=role)
        search = request.query_params.get("search")
        if search:
            profiles = profiles.filter(
                Q(user__email__icontains=search)
                | Q(user__username__icontains=search)
            )
        data = [
            {
                **UserSerializer.from_user(p.user),
                "created_at": p.created_at,
            }
            for p in profiles
        ]
        return Response({"success": True, "users": data})

    @method_decorator(csrf_protect)
    def post(self, request):
        return RegisterView.as_view()(request)


class UserDetailView(APIView):
    permission_classes = [IsSuperAdmin]

    def patch(self, request, user_id):
        user = User.objects.filter(pk=user_id).first()
        if user is None:
            return error_response(
                "Foydalanuvchi topilmadi.", "not_found", status.HTTP_404_NOT_FOUND
            )
        if (
            user == request.user
            and getattr(user, "profile", None)
            and request.data.get("role") != user.profile.role
        ):
            return error_response(
                "O'z rolingizni o'zgartira olmaysiz.",
                "forbidden",
                status.HTTP_403_FORBIDDEN,
            )

        profile = Profile.objects.get_or_create(
            user=user,
            defaults={"role": "superadmin" if user.is_superuser else "seller"},
        )[0]
        valid_roles = [c[0] for c in Profile._meta.get_field("role").choices]
        if "role" in request.data:
            role = request.data["role"]
            if role not in valid_roles:
                return error_response(
                    "Noto'g'ri rol.", "validation_error", status.HTTP_400_BAD_REQUEST
                )
            profile.role = role
        if "is_blocked" in request.data:
            blocked = bool(request.data["is_blocked"])
            if blocked and user == request.user:
                return error_response(
                    "O'zingizni bloklay olmaysiz.",
                    "forbidden",
                    status.HTTP_403_FORBIDDEN,
                )
            profile.is_blocked = blocked
        profile.save()
        if "is_active" in request.data and user != request.user:
            user.is_active = bool(request.data["is_active"])
            user.save(update_fields=["is_active"])
        return Response(
            {
                "success": True,
                "user": UserSerializer.from_user(user),
                "message": "Foydalanuvchi yangilandi.",
            }
        )

    @method_decorator(csrf_protect)
    def delete(self, request, user_id):
        user = User.objects.filter(pk=user_id).first()
        if user is None:
            return error_response(
                "Foydalanuvchi topilmadi.", "not_found", status.HTTP_404_NOT_FOUND
            )
        if user == request.user:
            return error_response(
                "O'zingizni o'chira olmaysiz.",
                "forbidden",
                status.HTTP_403_FORBIDDEN,
            )
        invalidate_user_tokens(user)
        user.delete()
        return Response(
            {"success": True, "message": "Foydalanuvchi o'chirildi."}
        )


class AdminStatsView(APIView):
    """Dashboard stats for superadmin / admin / manager."""

    permission_classes = [IsAdminOrAbove]

    def get(self, request):
        from django.db.models import Count, Sum
        from django.db.models.functions import TruncMonth

        from orders.models import Order, OrderItem
        from products.models import Category, Product
        from subscribers.models import Subscriber

        orders = Order.objects.all()
        revenue = orders.exclude(status="cancelled").aggregate(
            total=Sum("total_price")
        )["total"] or 0

        customers = set()
        for row in orders.values("email", "phone"):
            key = row.get("email") or row.get("phone")
            if key:
                customers.add(key)

        status_breakdown = (
            orders.values("status").annotate(count=Count("id")).order_by("status")
        )
        monthly = (
            orders.exclude(status="cancelled")
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(total=Sum("total_price"), count=Count("id"))
            .order_by("month")
        )

        top_products = (
            OrderItem.objects.values("product__title")
            .annotate(sold=Sum("quantity"), revenue=Sum("price"))
            .order_by("-sold")[:5]
        )

        recent_orders = OrderSerializer(
            orders.prefetch_related("items__product")[:5], many=True
        ).data

        return Response(
            {
                "success": True,
                "stats": {
                    "products": Product.objects.count(),
                    "categories": Category.objects.count(),
                    "orders": orders.count(),
                    "pending_orders": orders.filter(status="pending").count(),
                    "revenue": revenue,
                    "customers": len(customers),
                    "subscribers": Subscriber.objects.count(),
                    "low_stock": Product.objects.filter(stock__lte=10).count(),
                },
                "status_breakdown": list(status_breakdown),
                "monthly_revenue": list(monthly),
                "top_products": list(top_products),
                "recent_orders": recent_orders,
            }
        )