from rest_framework import serializers
from api.accounts.models import CustomUser
from .models import Setting


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone_number",  # match your model
            "company_name",  # match your model
        ]


class SettingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Setting
        fields = [
            "id",
            "user",
            "language",
            "timezone",
            "default_currency",
            "notification_email",
            "notification_sms",
            "dark_mode",
            "auto_backup_frequency",
        ]
