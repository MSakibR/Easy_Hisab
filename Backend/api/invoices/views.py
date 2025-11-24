from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Invoice
from .serializers import InvoiceSerializer
from .utils import generate_invoice_pdf  # Your PDF function
from api.payments.models import Payment
from datetime import date
from api.payments.utils import create_or_update_payment
from django.db.models import Q


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def invoice_view(request):
    if request.method == "GET":
        invoices = Invoice.objects.filter(user=request.user).order_by("-invoice_date")

        status_filter = request.GET.get("status")
        if status_filter:
            invoices = invoices.filter(status=status_filter)

        search_query = request.GET.get("search")
        if search_query:
            invoices = invoices.filter(
                Q(invoice_number__icontains=search_query)
                | Q(customer__contact_person__icontains=search_query)
            )

        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        data = request.data.copy()
        data["user"] = request.user.id
        serializer = InvoiceSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def invoice_detail(request, pk):
    try:
        invoice = Invoice.objects.get(pk=pk, user=request.user)
    except Invoice.DoesNotExist:
        return Response(
            {"error": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND
        )

    if request.method == "GET":
        serializer = InvoiceSerializer(invoice)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = InvoiceSerializer(invoice, data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        invoice.delete()
        return Response(
            {"message": "Invoice deleted"}, status=status.HTTP_204_NO_CONTENT
        )


def create_or_update_payment(invoice):
    # Determine payment status based on invoice payment method
    if invoice.payment_method in ["online", "offline"]:
        payment_status = "paid"
    elif invoice.payment_method == "credit":
        payment_status = "unpaid"
    else:
        payment_status = "pending"  # fallback for draft or unknown

    payment, created = Payment.objects.update_or_create(
        invoice=invoice,
        defaults={
            "customer": invoice.customer,
            "amount": invoice.total_amount,
            "issue_date": invoice.invoice_date,
            "due_date": invoice.due_date,
            "status": payment_status,  # ✅ Use dynamic status
        },
    )
    return payment


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_pdf(request, pk):
    try:
        invoice = Invoice.objects.get(pk=pk, user=request.user)
    except Invoice.DoesNotExist:
        return Response(
            {"error": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND
        )

    pdf_url = generate_invoice_pdf(invoice)
    if pdf_url:
        if invoice.payment_method in ["online", "offline"]:
            invoice.status = "paid"
        elif invoice.payment_method == "credit":
            invoice.status = "unpaid"
        else:
            invoice.status = "exported"  # fallback (optional)
        invoice.save()

        # ✅ Automatically create or update payment
        payment = create_or_update_payment(invoice)

        return Response(
            {
                "pdf_url": pdf_url,
                "payment_id": payment.id,
                "payment_status": payment.status,
            },
            status=status.HTTP_200_OK,
        )
    else:
        return Response(
            {"error": "Failed to generate PDF"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_invoice_paid(request, pk):
    try:
        invoice = Invoice.objects.get(pk=pk, user=request.user)
    except Invoice.DoesNotExist:
        return Response({"error": "Invoice not found"}, status=404)

    invoice.status = "paid"
    invoice.save()

    # Update or create Payment
    payment = create_or_update_payment(invoice)

    return Response(
        {
            "message": "Invoice marked as paid",
            "invoice_status": invoice.status,
            "payment_status": payment.status,
        }
    )
