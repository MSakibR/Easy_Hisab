# api/notifications/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from api.customers.models import Customer
from api.products.models import Products as Product
from api.notifications.models import Notification
from api.accounts.models import CustomUser
from api.invoices.models import Invoice


@receiver(post_save, sender=Customer)
def create_customer_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            CustomUser=instance.user,
            type="Customer",
            message=f"New customer '{instance.company_name}' has been created.",
        )


@receiver(post_save, sender=Product)
def create_product_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            CustomUser=instance.user,  # product owner
            type="Product",
            message=f"New product '{instance.name}' has been added.",
            status="unread"
        )


@receiver(post_save, sender=Product)
def low_stock_notification(sender, instance, **kwargs):
    if instance.stock_qty <= 5:
        # 1️⃣ Notify all staff users
        for user in CustomUser.objects.filter(is_staff=True):
            exists = Notification.objects.filter(
                CustomUser=user,
                type="low_stock",
                message__icontains=instance.name,
                status="unread",
            ).exists()
            if not exists:
                Notification.objects.create(
                    CustomUser=user,
                    type="low_stock",
                    message=f"Product '{instance.name}' stock is low ({instance.stock_qty})",
                    status="unread",
                )

        # 2️⃣ Notify the product owner
        owner = instance.user
        exists = Notification.objects.filter(
            CustomUser=owner,
            type="low_stock",
            message__icontains=instance.name,
            status="unread",
        ).exists()
        if not exists:
            Notification.objects.create(
                CustomUser=owner,
                type="low_stock",
                message=f"Your product '{instance.name}' stock is low ({instance.stock_qty})",
                status="unread",
            )


@receiver(post_save, sender=Invoice)
def create_invoice_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            CustomUser=instance.user,  # the user who created the invoice
            type="Invoice",
            message=f"New invoice '{instance.invoice_number}' has been created for customer '{instance.customer.company_name}'.",
            status="unread",
        )
