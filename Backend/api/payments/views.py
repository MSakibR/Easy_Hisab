from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Payment
from .serializers import PaymentSerializer
from django.db.models import Q


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def payment_view(request):
    if request.method == "GET":
        payments = Payment.objects.filter(customer__user=request.user)
        search_query = request.GET.get("search", "").strip()

        if search_query:
            payments = payments.filter(
                Q(invoice__invoice_number__icontains=search_query)
                | Q(customer__contact_person__icontains=search_query)
            )
            
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
