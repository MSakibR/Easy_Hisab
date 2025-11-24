from django.db import models


class Invoice(models.Model):
    user = models.ForeignKey(
        "accounts.CustomUser", on_delete=models.CASCADE, related_name="invoices"
    )
    customer = models.ForeignKey(
        "customers.Customer", on_delete=models.CASCADE, related_name="invoices"
    )
    invoice_number = models.CharField(max_length=50, unique=True)
    invoice_date = models.DateField()
    due_date = models.DateField()
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(
        max_length=50,
        choices=[("online", "Online"), ("offline", "Offline"), ("credit", "On Credit")],
    )
    pdf_file = models.FileField(
        upload_to="invoices/pdfs/", blank=True, null=True
    )  # NEW
    status = models.CharField(max_length=50, default="draft")
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Invoice {self.invoice_number}"


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(
        "invoices.Invoice", on_delete=models.CASCADE, related_name="items"
    )
    product = models.ForeignKey(
        "products.Products", on_delete=models.SET_NULL, null=True, blank=True
    )
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    total = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.product} x {self.quantity}"
