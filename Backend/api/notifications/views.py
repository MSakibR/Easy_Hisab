# api/notifications/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def notification_view(request):
    """
    Returns notifications for the logged-in user.
    """
    notifications = Notification.objects.filter(CustomUser=request.user).order_by(
        "-created_at"
    )
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_as_read(request, pk):
    try:
        notification = Notification.objects.get(id=pk, CustomUser=request.user)
        notification.status = "read"
        notification.save()
        return Response({"message": "Notification marked as read"})
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found"}, status=404)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_all_read(request):
    # mark all unread notifications for this user as read
    Notification.objects.filter(CustomUser=request.user, status="unread").update(
        status="read"
    )
    return Response({"message": "All notifications marked as read"})
