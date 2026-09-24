import os
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()


class Settings:
    # psql connection — matches the `agriqr_v2` database from agriqr_v2_schema.sql
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/agriqr_v2"
    )

    JWT_SECRET: str = os.getenv("JWT_SECRET", "change-me-in-prod")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRES: timedelta = timedelta(minutes=30)
    REFRESH_TOKEN_EXPIRES: timedelta = timedelta(days=14)

    # Trial policy (used once /plan/start-trial exists — not applied at
    # registration time, see the onboarding design doc).
    TRIAL_LENGTH: timedelta = timedelta(hours=72)
    # Trial allows 2 products total — but per the qr_type split enforced in
    # products_router.create_product, the two slots can't both hold the same
    # qr_type: one product must be 'static' and the other 'dynamic'.
    TRIAL_PRODUCT_CAP: int = 2
    TRIAL_STATIC_QR_CAP: int = 2
    TRIAL_DYNAMIC_QR_CAP: int = 2

    # A trial can run out two different ways: the 72-hour window elapses,
    # or the product/QR usage caps get hit first (e.g. a fast-moving team
    # burns through 2 static + 2 dynamic QR codes in the first hour).
    # These thresholds control the single "your trial is ending soon"
    # warning email — sent once, whichever condition trips first.
    TRIAL_WARNING_TIME_REMAINING: timedelta = timedelta(hours=24)
    TRIAL_WARNING_USAGE_FRACTION: float = 0.75

    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

    # --- Credentials email (sent right after registration) ---
    # If SMTP_HOST isn't set, emails are logged to the console instead of
    # sent — lets registration work end-to-end in dev without real SMTP.
    SMTP_HOST: str | None = os.getenv("SMTP_HOST")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str | None = os.getenv("SMTP_USER")
    SMTP_PASSWORD: str | None = os.getenv("SMTP_PASSWORD")
    SMTP_FROM: str = os.getenv("SMTP_FROM", "AgriQR <no-reply@agriqr.app>")
    SMTP_USE_TLS: bool = os.getenv("SMTP_USE_TLS", "true").lower() == "true"

    FRONTEND_BASE_URL: str = os.getenv("FRONTEND_BASE_URL", "http://localhost:3000")

    # Publicly reachable base URL of THIS backend (not the frontend).
    # Dynamic QR codes encode {PUBLIC_API_BASE_URL}/r/{qr_value} directly,
    # so a phone camera hits the backend and gets a real HTTP redirect —
    # no frontend route has to exist for the redirect itself to work.
    PUBLIC_API_BASE_URL: str = os.getenv("PUBLIC_API_BASE_URL", "http://localhost:8000")
    PASSWORD_RESET_TOKEN_EXPIRES: timedelta = timedelta(minutes=30)
    PASSWORD_RESET_RESEND_COOLDOWN: timedelta = timedelta(seconds=60)

settings = Settings()
