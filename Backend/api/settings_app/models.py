from django.db import models
from api.accounts.models import CustomUser


class Setting(models.Model):
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name="settings"
    )
    language = models.CharField(max_length=20, default="en")
    timezone = models.CharField(max_length=50, default="UTC")
    default_currency = models.CharField(max_length=10, default="USD")
    notification_email = models.BooleanField(default=True)
    notification_sms = models.BooleanField(default=False)
    dark_mode = models.BooleanField(default=False)
    auto_backup_frequency = models.CharField(max_length=50, default="weekly")

    def __str__(self):
        return f"Settings for {self.user.email}"
