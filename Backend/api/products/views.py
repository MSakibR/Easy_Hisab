from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Products
from .serializers import ProductSerializer


# List all products (for the logged-in user) OR create a new one
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def product_view(request):
    if request.method == "GET":
        products = Products.objects.filter(user=request.user)  # ✅ Only user’s products
        category = request.query_params.get("category")
        name = request.query_params.get("name")

        if category:
            products = products.filter(category__icontains=category)
        if name:
            products = products.filter(name__icontains=name)

        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        data = request.data.copy()
        data["user"] = request.user.id  # ✅ Attach logged-in user
        serializer = ProductSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Get, Update, Delete single product
@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def product_detail(request, pk):
    try:
        product = Products.objects.get(pk=pk, user=request.user)  # ✅ Only owner
    except Products.DoesNotExist:
        return Response(
            {"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND
        )

    if request.method == "GET":
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    elif request.method == "PUT":
        data = request.data.copy()
        data["user"] = request.user.id
        serializer = ProductSerializer(product, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
