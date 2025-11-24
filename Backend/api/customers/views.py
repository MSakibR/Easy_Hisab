from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Customer
from .serializers import CustomerSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q


# List all customers OR Create a new one
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def customer_view(request):
    if request.method == "GET":
        customers = Customer.objects.filter(user=request.user)
        search_query = request.GET.get("search")
        if search_query:
            customers = customers.filter(
                Q(company_name__icontains=search_query)
                | Q(contact_person__icontains=search_query)
            )
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        data = request.data.copy()
        serializer = CustomerSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  # <--- this will show exactly which fields failed
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Retrieve, Update or Delete a single customer
@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def customer_detail(request, pk):
    try:
        customer = Customer.objects.get(pk=pk)
    except Customer.DoesNotExist:
        return Response(
            {"error": "Customer not found"}, status=status.HTTP_404_NOT_FOUND
        )

    if request.method == "GET":
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        customer.delete()
        return Response(
            {"message": "Customer deleted"}, status=status.HTTP_204_NO_CONTENT
        )
