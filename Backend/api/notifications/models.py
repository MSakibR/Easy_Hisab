from django.db import models
from api.accounts.models import CustomUser


class Notification(models.Model):
    CustomUser = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="notifications"
    )
    type = models.CharField(max_length=50)
    message = models.TextField()
    status = models.CharField(max_length=20, default="unread")
    created_at = models.DateTimeField(auto_now_add=True)
