from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.accounts.models import CustomUser
from .models import Setting
from .serializers import UserSerializer, SettingSerializer


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def settings_view(request):
    user = request.user
    settings, created = Setting.objects.get_or_create(user=user)

    if request.method == "GET":
        return Response(
            {
                "message": "Hello from Django backend 👋, Form Settings Section",
                "user": UserSerializer(user).data,
                "settings": SettingSerializer(settings).data,
            }
        )

    elif request.method == "PUT":
        # Update user fields
        user_fields = [
            "first_name",
            "last_name",
            "email",
            "phone",
            "company",
            "address",
        ]
        for field in user_fields:
            if field in request.data:
                setattr(user, field, request.data[field])
        user.save()

        # Update settings fields
        setting_fields = [
            "language",
            "timezone",
            "default_currency",
            "notification_email",
            "notification_sms",
            "dark_mode",
            "auto_backup_frequency",
        ]
        for field in setting_fields:
            if field in request.data:
                setattr(settings, field, request.data[field])
        settings.save()

        return Response({"message": "Settings updated successfully"})
