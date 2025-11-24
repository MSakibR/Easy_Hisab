from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.contrib.auth.base_user import BaseUserManager


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email must be set")
        email = self.normalize_email(email)
        # For normal users, auto-generate username if not provided
        extra_fields.setdefault("username", email.split("@")[0])
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        # Ensure superuser has a username
        extra_fields.setdefault("username", "admin")  # or email.split("@")[0]
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self.create_user(email=email, password=password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=30, blank=True, null=True)  # First Name
    last_name = models.CharField(max_length=30, blank=True, null=True)  # Last Name
    username = models.CharField(
        max_length=150, unique=True
    )  # Optional, can be same as email
    email = models.EmailField(unique=True)  # Email
    phone_number = models.CharField(max_length=20)  # Phone Number
    company_name = models.CharField(max_length=100)  # Company Name

    profile_picture = models.ImageField(
        upload_to="profile_pics/", blank=True, null=True  # folder inside MEDIA_ROOT
    )

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"  # Login with email
    REQUIRED_FIELDS = [
        "first_name",
        "last_name",
    ]  # Required on createsuperuser

    def __str__(self):
        return self.email
