from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def report_view(request):
    return Response({"message": "Hello from Django backend 👋, Form Report Section"})
