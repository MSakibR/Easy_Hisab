from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def invoice_view(request):
    return Response({"message": "Hello from Django backend 👋, Form Invoice Section"})
