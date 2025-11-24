from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings

from api.test.views import hello_world

from api.accounts.views import current_user, update_user
from api.accounts.views import signup
from api.accounts.views import login
from api.accounts.views import google_login
from api.accounts.views import google_signup
from api.accounts.views import logout_view

from api.invoices.views import (
    invoice_view,
    invoice_detail,
    generate_pdf,
    mark_invoice_paid,
)
from api.customers.views import customer_view
from api.customers.views import customer_detail
from api.products.views import product_view, product_detail
from api.payments.views import payment_view
from api.notifications.views import notification_view, mark_as_read, mark_all_read
from api.dashboard.views import dashboard_view
from api.settings_app.views import settings_view
from api.help.views import help_view
from api.report.views import report_view


urlpatterns = [
    path("", hello_world, name="hello-world"),
    path("signup/", signup, name="signup"),
    path("login/", login, name="login"),
    path("google-login/", google_login, name="google-login"),
    path("google-signup/", google_signup, name="google-signup"),
    path("logout/", logout_view, name="logout"),
    path("settings/", settings_view, name="settings"),
    path("help/", help_view, name="help"),
    path("dashboard/", dashboard_view, name="dashboard"),
    path("me/", current_user, name="current-user"),
    path("me/update/", update_user, name="update-user"),
    path("product/", product_view, name="product"),
    path("product/<int:pk>/", product_detail, name="product-detail"),
    path("payment/", payment_view, name="payment"),
    path("notification/", notification_view, name="notification"),
    path("notification/<int:pk>/mark_as_read/", mark_as_read, name="mark-as-read"),
    path("notification/mark_all_read/", mark_all_read, name="mark-all-read"),
    path("invoice/", invoice_view, name="invoice"),
    path("invoice/<int:pk>/", invoice_detail, name="invoice-detail"),
    path("invoice/<int:pk>/generate_pdf/", generate_pdf, name="invoice-generate-pdf"),
    path("invoice/<int:pk>/mark_paid/", mark_invoice_paid, name="invoice-mark-paid"),
    path("customer/", customer_view, name="customer"),
    path("customer/<int:pk>/", customer_detail, name="customer-detail"),
    path("report/", report_view, name="report"),
    path("<int:id>/", report_view, name="report-id-detail"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
