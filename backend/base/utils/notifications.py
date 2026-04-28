from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from base.models import Notification


def create_notification(sender, recipient, notification_type, message, post=None):
    """
    Create a notification record and push it via WebSocket in real-time.
    Does nothing if sender == recipient (no self-notifications).
    """
    if sender == recipient:
        return None

    notification = Notification.objects.create(
        sender=sender,
        recipient=recipient,
        notification_type=notification_type,
        message=message,
        post=post,
    )

    # Push via WebSocket to the recipient's notification channel
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"notifications_{recipient.username}",
        {
            "type": "send_notification",
            "notification": {
                "id": notification.id,
                "sender_username": sender.username,
                "sender_profile_image": sender.profile_image or "",
                "notification_type": notification_type,
                "message": message,
                "post_id": post.id if post else None,
                "is_read": False,
                "created_at": notification.created_at.isoformat(),
            }
        }
    )

    return notification
