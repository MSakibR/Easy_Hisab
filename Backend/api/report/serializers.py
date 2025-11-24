# api/reports/serializers.py
from rest_framework import serializers
from .models import Report
from invoices.models import Invoice
from customers.models import Customer
from payments.models import Payment


class ReportSerializer(serializers.ModelSerializer):
    total_invoices = serializers.SerializerMethodField()
    total_revenue = serializers.SerializerMethodField()
    total_customers = serializers.SerializerMethodField()
    total_payments = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = [
            "id",
            "report_type",
            "start_date",
            "end_date",
            "total_invoices",
            "total_revenue",
            "total_customers",
            "total_payments",
            "generated_at",
        ]

    def get_total_invoices(self, obj):
        return Invoice.objects.filter(
            user=obj.user, invoice_date__range=[obj.start_date, obj.end_date]
        ).count()

    def get_total_revenue(self, obj):
        invoices = Invoice.objects.filter(
            user=obj.user, invoice_date__range=[obj.start_date, obj.end_date]
        )
        return sum([inv.total_amount for inv in invoices])

    def get_total_customers(self, obj):
        return Customer.objects.filter(
            user=obj.user, created_at__date__range=[obj.start_date, obj.end_date]
        ).count()

    def get_total_payments(self, obj):
        payments = Payment.objects.filter(
            customer__user=obj.user,
            issue_date__range=[obj.start_date, obj.end_date],
            status="paid",
        )
        return sum([p.amount for p in payments])
