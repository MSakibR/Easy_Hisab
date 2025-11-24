from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    customer_contact_person = serializers.CharField(
        source="customer.contact_person", read_only=True
    )
    invoice_number = serializers.CharField(
        source="invoice.invoice_number", read_only=True
    )

    class Meta:
        model = Payment
        fields = "__all__"
        read_only_fields = ("id", "invoice", "customer", "amount", "status")
