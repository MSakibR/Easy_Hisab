from django.db import models
from api.accounts.models import CustomUser


class Products(models.Model):  # ✅ PascalCase singular
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="products"
    )
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100, blank=True, null=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_qty = models.IntegerField(default=0)
    status = models.CharField(max_length=50, default="in_stock")
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
