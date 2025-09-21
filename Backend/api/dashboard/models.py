from django.db import models
from api.accounts.models import CustomUser


class DashboardCache(models.Model):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="dashboard_cache"
    )
    date = models.DateField()
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_invoices = models.IntegerField(default=0)
    total_customers = models.IntegerField(default=0)
    gst_collected = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    items_sold = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
