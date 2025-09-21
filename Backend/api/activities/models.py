from django.db import models
from api.accounts.models import CustomUser


class ActivityLog(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="activities")
    action = models.CharField(max_length=255)
    entity = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
