from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.test.views import hello_world

from api.accounts.views import profile_view
from api.invoices.views import invoice_view
from api.customers.views import customer_view
from api.products.views import product_view
from api.payments.views import payment_view
from api.notifications.views import notification_view
from api.dashboard.views import dashboard_view
from api.settings_app.views import settings_view
from api.help.views import help_view
from api.report.views import report_view


urlpatterns = [
    path("", hello_world, name="hello-world"),  # 👈 Test endpoint
    path("settings/", settings_view, name="settings"),  # 👈 Settings endpoint
    path("help/", help_view, name="help"),  # 👈 Help endpoint
    path("dashboard/", dashboard_view, name="dashboard"),  # 👈 Dashboard endpoint
    path("profile/", profile_view, name="profile"),  # 👈 Profile endpoint
    path("product/", product_view, name="product"),  # 👈 Product endpoint
    path("payment/", payment_view, name="payment"),  # 👈 Payment endpoint
    path(
        "notification/", notification_view, name="notification"
    ),  # 👈 Notification endpoint
    path("invoice/", invoice_view, name="invoice"),  # 👈 Invoice endpoint
    path("customer/", customer_view, name="customer"),  # 👈 Customer endpoint
    
    path("report/", report_view, name="report"),  # 👈 Report endpoint
    path("<int:id>/", report_view, name="report-id-detail"),
]
