from rest_framework_simplejwt.authentication import JWTAuthentication


class CookieJWTAuthentication(JWTAuthentication):
    """
    JWT authentication that accepts the access token from the HttpOnly
    `access_token` cookie as a fallback to the Authorization header.
    """

    def authenticate(self, request):
        raw = request.COOKIES.get("access_token")
        if raw:
            validated = self.get_validated_token(raw)
            return self.get_user(validated), validated
        return super().authenticate(request)