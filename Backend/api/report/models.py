from django.db import models
from api.accounts.models import CustomUser


class Report(models.Model):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="reports"
    )
    report_type = models.CharField(max_length=50)  # sales, customer, product, payment
    start_date = models.DateField()
    end_date = models.DateField()
    total_invoices = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_customers = models.IntegerField(default=0)
    total_payments = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.report_type} report ({self.start_date} to {self.end_date})"
