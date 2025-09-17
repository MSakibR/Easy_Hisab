from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import hello_world, settings_view, help_view, dashboard_view, profile_view, product_view, payment_view, notification_view, invoice_view, customer_view, report_view


urlpatterns = [
    path("hello/", hello_world),  # 👈 Test endpoint
    path("settings/", settings_view),  # 👈 Settings endpoint
    path("help/", help_view),  # 👈 Help endpoint
    path("dashboard/", dashboard_view),  # 👈 Dashboard endpoint
    path("profile/", profile_view),  # 👈 Profile endpoint
    path("product/", product_view),  # 👈 Product endpoint
    path("payment/", payment_view),  # 👈 Payment endpoint
    path("notification/", notification_view),  # 👈 Notification endpoint
    path("invoice/", invoice_view),  # 👈 Invoice endpoint
    path("customer/", customer_view),  # 👈 Customer endpoint
    path("report/", report_view),  # 👈 Report endpoint
]
