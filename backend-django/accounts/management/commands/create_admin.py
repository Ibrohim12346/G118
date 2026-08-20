from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from accounts.models import Profile

User = get_user_model()


class Command(BaseCommand):
    help = "Create an admin-panel user with a role."

    def add_arguments(self, parser):
        parser.add_argument("--email", required=True, help="Email address")
        parser.add_argument("--password", required=True, help="Password (min 8 chars)")
        parser.add_argument(
            "--name", default="", help="Full name (optional)"
        )
        parser.add_argument(
            "--role",
            default="admin",
            choices=[c[0] for c in Profile._meta.get_field("role").choices],
            help="Role: superadmin | admin | manager | seller",
        )

    def handle(self, *args, **options):
        email = options["email"].lower()
        if User.objects.filter(email__iexact=email).exists():
            self.stdout.write(
                self.style.WARNING(f"User with email {email} already exists.")
            )
            return

        username = email.split("@")[0]
        base = username
        i = 1
        while User.objects.filter(username=username).exists():
            username = f"{base}{i}"
            i += 1

        parts = options["name"].split(" ", 1)
        user = User.objects.create_user(
            username=username,
            email=email,
            password=options["password"],
            first_name=parts[0] if parts else "",
            last_name=parts[1] if len(parts) > 1 else "",
            is_staff=True,
            is_superuser=(options["role"] == "superadmin"),
        )
        profile = Profile.objects.get(user=user)
        profile.role = options["role"]
        profile.save(update_fields=["role"])

        self.stdout.write(
            self.style.SUCCESS(
                f"Created {options['role']} user: {email} (username: {user.username})"
            )
        )