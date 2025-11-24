# api/reports/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from datetime import datetime
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth

from api.invoices.models import Invoice
from api.customers.models import Customer
from api.payments.models import Payment


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def report_view(request):
    """
    Returns a summary report for the logged-in user
    Optional query params: start_date, end_date in YYYY-MM-DD format
    """
    user = request.user
    start_date = request.query_params.get("start_date")
    end_date = request.query_params.get("end_date")

    # Default: all time
    invoices = Invoice.objects.filter(user=user)
    customers = Customer.objects.filter(user=user)
    payments = Payment.objects.filter(customer__user=user, status="paid")

    # Filter by dates if provided
    if start_date and end_date:
        try:
            start = datetime.strptime(start_date, "%Y-%m-%d").date()
            end = datetime.strptime(end_date, "%Y-%m-%d").date()
            invoices = invoices.filter(invoice_date__range=[start, end])
            customers = customers.filter(created_at__date__range=[start, end])
            payments = payments.filter(issue_date__range=[start, end])
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"}, status=400
            )

    # Totals
    total_invoices = invoices.count()
    total_revenue = sum(inv.total_amount for inv in invoices)
    total_customers = customers.count()
    total_payments = sum(p.amount for p in payments)

    # Revenue Trend (Monthly)
    revenue_qs = (
        invoices.annotate(month=TruncMonth("invoice_date"))
        .values("month")
        .annotate(total=Sum("total_amount"))
        .order_by("month")
    )
    revenue_trend = {
        "labels": [r["month"].strftime("%b %Y") for r in revenue_qs],
        "datasets": [
            {
                "label": "Revenue",
                "data": [r["total"] for r in revenue_qs],
                "backgroundColor": "rgba(54, 162, 235, 0.5)",
                "borderColor": "rgba(54, 162, 235, 1)",
                "borderWidth": 1,
            }
        ],
    }

    # Invoice Status
    status_qs = invoices.values("status").annotate(count=Count("id"))
    invoice_status = {
        "labels": [r["status"].capitalize() for r in status_qs],
        "datasets": [
            {
                "label": "Invoices",
                "data": [r["count"] for r in status_qs],
                "backgroundColor": [
                    "#4ade80",
                    "#facc15",
                    "#f87171",
                ],  # Paid, Pending, Overdue
            }
        ],
    }

    data = {
        "total_invoices": total_invoices,
        "total_revenue": total_revenue,
        "total_customers": total_customers,
        "total_payments": total_payments,
        "revenue_trend": revenue_trend,
        "invoice_status": invoice_status,
    }

    return Response(data)
