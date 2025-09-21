from django.db import models
from api.accounts.models import CustomUser


class Customer(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="customers")
    company_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, default="active")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.company_name} - {self.contact_person}"
