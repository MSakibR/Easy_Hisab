from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.utils.timezone import now
from datetime import date, timedelta
from decimal import Decimal

# Import models from different apps
from api.invoices.models import Invoice, InvoiceItem
from api.customers.models import Customer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_view(request):
    user = request.user
    today = date.today()

    # --- Cards ---
    today_invoices = Invoice.objects.filter(user=user, invoice_date=today)
    today_revenue = today_invoices.aggregate(total=Sum("total_amount"))["total"] or 0
    gst_collected = today_revenue * Decimal("0.15")  # Example GST 15%
    items_sold_today = (
        InvoiceItem.objects.filter(
            invoice__user=user, invoice__invoice_date=today
        ).aggregate(total=Sum("quantity"))["total"]
        or 0
    )
    unpaid_invoices = (
        Invoice.objects.filter(user=user, status="unpaid").aggregate(
            total=Sum("total_amount")
        )["total"]
        or 0
    )
    new_customers = Customer.objects.filter(user=user, created_at__date=today).count()

    # Profit (example logic)
    today_pl = today_revenue * Decimal("0.2")

    # --- Charts ---
    # 1️⃣ Best Selling Products (Top 5)
    best_products = (
        InvoiceItem.objects.filter(invoice__user=user)
        .values("product__name")
        .annotate(total_sold=Sum("quantity"))
        .order_by("-total_sold")[:5]
    )
    best_selling_products = {
        "labels": [p["product__name"] for p in best_products],
        "data": [p["total_sold"] for p in best_products],
    }

    # 2️⃣ Monthly Revenue (last 6 months)
    monthly_data = (
        Invoice.objects.filter(user=user)
        .extra(select={"month": "strftime('%%Y-%%m', invoice_date)"})
        .values("month")
        .annotate(total=Sum("total_amount"))
        .order_by("month")
    )
    monthly_revenue = {
        "labels": [m["month"] for m in monthly_data],
        "data": [float(m["total"]) for m in monthly_data],
    }

    # 3️⃣ Daily Sales Volume (last 7 days)
    last_week = today - timedelta(days=6)
    daily_sales = (
        Invoice.objects.filter(user=user, invoice_date__gte=last_week)
        .values("invoice_date")
        .annotate(total=Sum("total_amount"))
        .order_by("invoice_date")
    )
    daily_sales_volume = {
        "labels": [d["invoice_date"].strftime("%b %d") for d in daily_sales],
        "data": [float(d["total"]) for d in daily_sales],
    }

    # 4️⃣ Customer Growth (last 6 months)
    customer_growth_data = (
        Customer.objects.filter(user=user)
        .extra(select={"month": "strftime('%%Y-%%m', created_at)"})
        .values("month")
        .annotate(total=Count("id"))
        .order_by("month")
    )
    customer_growth = {
        "labels": [c["month"] for c in customer_growth_data],
        "data": [c["total"] for c in customer_growth_data],
    }

    # --- Response Data ---
    data = {
        "today_pl": today_pl,
        "today_revenue": today_revenue,
        "gst_collected": gst_collected,
        "items_sold_today": items_sold_today,
        "unpaid_invoices": unpaid_invoices,
        "new_customers": new_customers,
        "best_selling_products": best_selling_products,
        "monthly_revenue": monthly_revenue,
        "daily_sales_volume": daily_sales_volume,
        "customer_growth": customer_growth,
        "last_updated": now(),
    }

    return Response(data)
