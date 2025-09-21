from django.db import models


class Payment(models.Model):
    invoice = models.ForeignKey(
        "invoices.Invoice", on_delete=models.CASCADE, related_name="payments"
    )
    customer = models.ForeignKey(
        "customers.Customer", on_delete=models.CASCADE, related_name="payments"
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    issue_date = models.DateField()
    due_date = models.DateField()
    status = models.CharField(max_length=50, default="pending")
    payment_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"Payment for Invoice {self.invoice.invoice_number}"
