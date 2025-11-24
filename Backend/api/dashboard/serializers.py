from rest_framework import serializers


class DashboardDataSerializer(serializers.Serializer):
    # Summary cards
    today_pl = serializers.DecimalField(max_digits=12, decimal_places=2)
    today_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    gst_collected = serializers.DecimalField(max_digits=12, decimal_places=2)
    items_sold_today = serializers.IntegerField()
    unpaid_invoices = serializers.DecimalField(max_digits=12, decimal_places=2)
    new_customers = serializers.IntegerField()

    # Chart data
    best_selling_products = serializers.DictField()
    monthly_revenue = serializers.DictField()
    daily_sales_volume = serializers.DictField()
    customer_growth = serializers.DictField()

    last_updated = serializers.DateTimeField()
