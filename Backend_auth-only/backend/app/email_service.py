"""
Sends the post-registration credentials email.

Flagged in the onboarding design doc: emailing a plaintext password is a
known security smell (email isn't a secure channel). This is built to the
literal spec you asked for — swap this for a signed "set your password"
link later if you'd rather avoid ever putting a password in an email body.

If SMTP_HOST isn't configured (the default in dev), the email is logged
to the console instead of sent, so registration works end-to-end without
needing real SMTP credentials on hand.
"""
import logging
import smtplib
from email.message import EmailMessage

from .config import settings

logger = logging.getLogger("agriqr.email")


def send_credentials_email(*, to_email: str, full_name: str, company_name: str, password: str) -> None:
    subject = "Your AgriQR account is ready"
    body = (
        f"Hi {full_name},\n\n"
        f"Your AgriQR account for {company_name} is set up.\n\n"
        f"Login email: {to_email}\n"
        f"Password: {password}\n\n"
        f"For security, you'll be asked to set a new password the first time you log in.\n\n"
        f"— AgriQR"
    )

    if not settings.SMTP_HOST:
        logger.info(
            "[DEV EMAIL — SMTP not configured, logging instead of sending]\nTo: %s\nSubject: %s\n\n%s",
            to_email,
            subject,
            body,
        )
        return

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_FROM
    msg["To"] = to_email
    msg.set_content(body)

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as smtp:
            if settings.SMTP_USE_TLS:
                smtp.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            smtp.send_message(msg)
    except Exception:
        # Registration must not fail just because the email couldn't be
        # sent — the account is already created and the frontend has an
        # active session from the response. Log loudly and move on.
        logger.exception("Failed to send credentials email to %s", to_email)


def send_trial_ending_soon_email(
    *, to_email: str, full_name: str, company_name: str, reason: str
) -> None:
    """
    Sent once per company, the first time GET /plan/status notices the
    trial is close to ending — either the 72-hour window is running out
    (reason describes hours left) or usage is close to a cap (reason
    describes which one), whichever trips first. See
    plan_router._maybe_send_trial_warning.
    """
    subject = "Your AgriQR free trial is ending soon"
    body = (
        f"Hi {full_name},\n\n"
        f"Heads up — {reason}\n\n"
        f"To keep {company_name} generating QR codes without interruption, "
        f"you can either:\n\n"
        f"  1. Subscribe — unlimited SKUs and QR codes, billed per SKU per year.\n"
        f"  2. Request self-hosting — run AgriQR on your own infrastructure; "
        f"our team sets it up with you.\n\n"
        f"Nothing you've already created will be lost either way — this only "
        f"affects your ability to add new products or generate new QR codes "
        f"once the trial ends.\n\n"
        f"— AgriQR"
    )

    if not settings.SMTP_HOST:
        logger.info(
            "[DEV EMAIL — SMTP not configured, logging instead of sending]\nTo: %s\nSubject: %s\n\n%s",
            to_email,
            subject,
            body,
        )
        return

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_FROM
    msg["To"] = to_email
    msg.set_content(body)

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as smtp:
            if settings.SMTP_USE_TLS:
                smtp.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            smtp.send_message(msg)
    except Exception:
        logger.exception("Failed to send trial-ending-soon email to %s", to_email)


def send_password_reset_email(*, to_email: str, full_name: str, reset_link: str, expires_minutes: int) -> None:
    subject = "Reset your AgriQR password"
    body = (
        f"Hi {full_name},\n\n"
        f"We received a request to reset your AgriQR password. Click the link "
        f"below to choose a new one:\n\n"
        f"{reset_link}\n\n"
        f"This link expires in {expires_minutes} minutes and can only be used once.\n\n"
        f"If you didn't request this, you can safely ignore this email — your "
        f"password won't be changed.\n\n"
        f"— AgriQR"
    )

    if not settings.SMTP_HOST:
        logger.info(
            "[DEV EMAIL — SMTP not configured, logging instead of sending]\nTo: %s\nSubject: %s\n\n%s",
            to_email,
            subject,
            body,
        )
        return

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_FROM
    msg["To"] = to_email
    msg.set_content(body)

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as smtp:
            if settings.SMTP_USE_TLS:
                smtp.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            smtp.send_message(msg)
    except Exception:
        logger.exception("Failed to send password reset email to %s", to_email)