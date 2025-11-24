from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import SignupSerializer, LoginSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from google.oauth2 import id_token
from google.auth.transport import requests
from .models import CustomUser
from .utils import get_tokens_for_user
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response


GOOGLE_CLIENT_ID = (
    "857762176087-rj8j3odt8g5ecqqr14ltvpfgdri3rskt.apps.googleusercontent.com"
)


@api_view(["POST"])
def google_login(request):
    token = request.data.get("token")
    if not token:
        return Response({"error": "No token provided"}, status=400)

    try:
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), GOOGLE_CLIENT_ID
        )
        email = idinfo["email"]

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "No account found with this email. Please sign up first."},
                status=400,
            )

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": {
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
            }
        )
    except ValueError:
        return Response({"error": "Invalid token"}, status=400)


@api_view(["POST"])
def google_signup(request):
    token = request.data.get("token")
    if not token:
        return Response({"error": "No token provided"}, status=400)

    try:
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), GOOGLE_CLIENT_ID
        )
        email = idinfo["email"]

        # Check if already exists
        if CustomUser.objects.filter(email=email).exists():
            return Response(
                {"error": "Account already exists. Please login."}, status=400
            )

        user = CustomUser.objects.create_user(
            email=email,
            username=email.split("@")[0],
            first_name=idinfo.get("given_name", ""),
            last_name=idinfo.get("family_name", ""),
            password=None,  # No password for Google users
        )

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": {
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
            }
        )

    except ValueError:
        return Response({"error": "Invalid token"}, status=400)


@api_view(["POST"])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response(
            {
                "message": "User created successfully",
                "user": {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "phone_number": user.phone_number,
                    "company_name": user.company_name,
                },
                "tokens": tokens,
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data["user"]
        tokens = get_tokens_for_user(user)
        return Response(
            {
                "message": "Login successful",
                "user": {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "phone_number": user.phone_number,
                    "company_name": user.company_name,
                },
                "tokens": tokens,
            }
        )
    return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["GET"])
def current_user(request):
    user = request.user
    return Response(
        {
            "first_name": user.first_name,
            "company_name": user.company_name,
            "email": user.email,
            "phone_number": user.phone_number,
            "company_name": user.company_name,
            "profile_picture": (
                user.profile_picture.url if user.profile_picture else None
            ),
        }
    )


@api_view(["PUT"])
def update_user(request):
    user = request.user
    data = request.data
    user.first_name = data.get("first_name", user.first_name)
    user.last_name = data.get("last_name", user.last_name)
    user.email = data.get("email", user.email)
    user.phone_number = data.get("phone_number", user.phone_number)
    user.company_name = data.get("company_name", user.company_name)
    profile_picture = request.FILES.get("profile_picture")
    if profile_picture:
        user.profile_picture = profile_picture
    user.save()
    return Response({"message": "Profile updated successfully!"})


@api_view(["POST"])
def logout_view(request):
    refresh_token = request.data.get("refresh")
    if not refresh_token:
        return Response(
            {"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response(
            {"detail": "Logged out successfully"}, status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
