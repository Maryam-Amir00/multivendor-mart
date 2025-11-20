# users/utils.py
from django.conf import settings
from django.core.mail import send_mail
import jwt
from datetime import datetime, timedelta

def generate_email_token(user):
    payload = {
        "user_id": user.id,
        "new_email": user.pending_email,
        "exp": datetime.utcnow() + timedelta(hours=2),
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    return token

def send_verification_email(user):
    token = generate_email_token(user)
    verify_url = f"http://localhost:5173/verify-email/{token}"  # frontend route for verification
    subject = "Verify your new email address"
    body = f"Click the link to verify your new email: {verify_url}\n\nIf you didn't request this, ignore."
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@example.com")
    send_mail(subject, body, from_email, [user.pending_email], fail_silently=False)
