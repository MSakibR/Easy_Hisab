from rest_framework import serializers
from .models import Invoice, InvoiceItem


class InvoiceItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = InvoiceItem
        fields = ["id", "product", "product_name", "unit_price", "quantity", "total"]


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, required=False)
    user_info = serializers.SerializerMethodField()
    customer_info = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = [
            "id",
            "user",
            "user_info",
            "customer",
            "customer_info",
            "invoice_number",
            "invoice_date",
            "due_date",
            "subtotal",
            "tax",
            "total_amount",
            "payment_method",
            "status",
            "notes",
            "items",
        ]
        read_only_fields = ["user"]

    def get_user_info(self, obj):
        return {
            "username": obj.user.username,
            "first_name": obj.user.first_name,
            "last_name": obj.user.last_name,
            "email": obj.user.email,
            "phone_number": obj.user.phone_number,
            "company_name": obj.user.company_name,
        }

    def get_customer_info(self, obj):
        return {
            "contact_person": obj.customer.contact_person,
            "company_name": obj.customer.company_name,
            "email": obj.customer.email,
            "phone": obj.customer.phone,
            "address": obj.customer.address,
        }

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        invoice = Invoice.objects.create(**validated_data)
        for item_data in items_data:
            product = item_data.get("product")
            quantity = item_data.get("quantity", 0)

            # Deduct stock
            if product and product.stock_qty >= quantity:
                product.stock_qty -= quantity
                product.save()
            else:
                raise serializers.ValidationError(
                    f"Not enough stock for {product.name}"
                )

            # Create InvoiceItem
            InvoiceItem.objects.create(invoice=invoice, **item_data)

        return invoice

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        instance.items.all().delete()
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=instance, **item_data)
        return instance
