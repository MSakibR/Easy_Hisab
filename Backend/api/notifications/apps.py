# api/notifications/apps.py
from django.apps import AppConfig


class NotificationsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api.notifications"

    def ready(self):
        # Import signals to register them
        _ = __import__("api.notifications.signals")
