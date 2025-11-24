from .models import Payment
from django.utils import timezone


def create_or_update_payment(invoice):
    """
    Create a new payment record for the invoice if it doesn't exist,
    otherwise update the existing one.
    """
    payment, created = Payment.objects.get_or_create(
        invoice=invoice,
        customer=invoice.customer,
        defaults={
            "amount": invoice.total_amount,
            "issue_date": invoice.invoice_date,
            "due_date": invoice.due_date,
            "status": "pending",  # default status
        },
    )

    if not created:
        # Update the existing payment if invoice values changed
        payment.amount = invoice.total_amount
        payment.due_date = invoice.due_date
        payment.status = "pending"
        payment.save()

    return payment
