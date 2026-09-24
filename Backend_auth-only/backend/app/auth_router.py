from datetime import datetime, timezone

import asyncpg
from fastapi import APIRouter, HTTPException, status
from fastapi import Depends
from .config import settings
from .deps import CurrentUser, get_current_user
from .schemas import (
    AuthResponse,
    ChangePasswordRequest,
    ChangePasswordResponse,
    CompanyOut,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    RegisterCompanyRequest,
    ResetPasswordRequest,
    ResetPasswordResponse,
    UserOut,
)
from .db import get_pool
from .email_service import send_credentials_email, send_password_reset_email
from .schemas import AuthResponse, CompanyOut, RegisterCompanyRequest, UserOut
from .security import create_access_token, create_refresh_token, generate_temp_password, hash_password
from .schemas import AuthResponse, CompanyOut, LoginRequest, RegisterCompanyRequest, UserOut
from .security import (
    create_access_token,
    create_refresh_token,
    generate_reset_token,
    generate_temp_password,
    hash_password,
    hash_reset_token,
    verify_password,
)
router = APIRouter(prefix="/auth", tags=["auth"])
@router.post("/company/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register_company(payload: RegisterCompanyRequest):
    """
    Registration only — no trial is started here. The company lands in
    onboarding_state='awaiting_plan' and picks "Start Free Trial" or
    "Subscribe" on /onboarding/plan.

    The user sets their own password at signup — no temp password is
    generated or emailed, and must_change_password is always false for
    accounts created this way. Forgot-password (a separate secure
    token-based flow) is the path for account recovery.

    Compliance/KYC (GST, PAN, FCO licence) and banking details are not
    collected at signup either — those columns are left NULL and can be
    filled in later from the profile page.
    """
    pool = get_pool()
    async with pool.acquire() as conn:
        existing = await conn.fetchrow("SELECT id FROM users WHERE email = $1", payload.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists."
            )

        try:
            async with conn.transaction():
                address = await conn.fetchrow(
                    """
                    INSERT INTO addresses (line1, line2, city, state, pincode, country)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING address_id
                    """,
                    payload.address.line1,
                    payload.address.line2,
                    payload.address.city,
                    payload.address.state,
                    payload.address.pincode,
                    payload.address.country,
                )

                company = await conn.fetchrow(
                    """
                    INSERT INTO companies (
                        company_name, email, mobile_number, address_id, logo_url
                    )
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING company_id, company_name, onboarding_state, trial_ends_at, logo_url
                    """,
                    payload.company_name,
                    payload.email,
                    payload.phone,
                    address["address_id"],
                    payload.logo_url,
                )

                user = await conn.fetchrow(
                    """
                    INSERT INTO users (company_id, email, password_hash, full_name, phone, must_change_password)
                    VALUES ($1, $2, $3, $4, $5, false)
                    RETURNING id, email, full_name, role, must_change_password
                    """,
                    company["company_id"],
                    payload.email,
                    hash_password(payload.password),
                    payload.full_name,
                    payload.phone,
                )
        except asyncpg.UniqueViolationError:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists."
            )

    access_token = create_access_token(user["id"], company["company_id"], user["role"])
    refresh_token = create_refresh_token(user["id"], company["company_id"], user["role"])

    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        company=CompanyOut(
            id=company["company_id"],
            name=company["company_name"],
            onboarding_state=company["onboarding_state"],
            trial_ends_at=company["trial_ends_at"],
            logo_url=company["logo_url"],
        ),
        user=UserOut(**user),
    )

@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest):
    """
    Email + password login. Works for both a freshly-registered user still
    on their auto-generated temp password (must_change_password=true) and
    a user who has since set their own — the frontend decides what to do
    with must_change_password once it gets the response back.
    """
    pool = get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT
                u.id, u.password_hash, u.full_name, u.email, u.role,
                u.is_active, u.must_change_password,
                c.company_id, c.company_name, c.onboarding_state,
                c.trial_ends_at, c.logo_url, c.account_status
            FROM users u
            JOIN companies c ON c.company_id = u.company_id
            WHERE u.email = $1
            """,
            payload.email,
        )

    invalid = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password."
    )

    if not row or not verify_password(payload.password, row["password_hash"]):
        raise invalid
    if not row["is_active"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This account has been deactivated.")
    if row["account_status"] == "suspended":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This company account is suspended.")

    access_token = create_access_token(row["id"], row["company_id"], row["role"])
    refresh_token = create_refresh_token(row["id"], row["company_id"], row["role"])

    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        company=CompanyOut(
            id=row["company_id"],
            name=row["company_name"],
            onboarding_state=row["onboarding_state"],
            trial_ends_at=row["trial_ends_at"],
            logo_url=row["logo_url"],
        ),
        user=UserOut(
            id=row["id"],
            email=row["email"],
            full_name=row["full_name"],
            role=row["role"],
            must_change_password=row["must_change_password"],
        ),
    )

@router.post("/change-password", response_model=ChangePasswordResponse)
async def change_password(
    payload: ChangePasswordRequest,
    current_user: CurrentUser = Depends(get_current_user),
):
    """
    Requires the caller to know their current password — including
    right after registration, where "current password" is the
    auto-generated temp password we emailed them. Flips
    must_change_password to false once it succeeds.
    """
    pool = get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT id, password_hash FROM users WHERE id = $1",
            current_user.user_id,
        )
        if not row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

        if not verify_password(payload.current_password, row["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Current password is incorrect."
            )

        if payload.new_password == payload.current_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="New password must be different from the current password.",
            )

        updated = await conn.fetchrow(
            """
            UPDATE users
            SET password_hash = $1, must_change_password = false, updated_at = now()
            WHERE id = $2
            RETURNING id, email, full_name, role, must_change_password
            """,
            hash_password(payload.new_password),
            current_user.user_id,
        )

    return ChangePasswordResponse(message="Password updated successfully.", user=UserOut(**updated))

@router.post("/forgot-password", response_model=ForgotPasswordResponse)
async def forgot_password(payload: ForgotPasswordRequest):
    """
    Always returns the same generic message whether or not the email
    matches an account, so this endpoint can't be used to enumerate
    which emails are registered.
    """
    generic_response = ForgotPasswordResponse(
        message="If an account exists for that email, we've sent password reset instructions."
    )

    pool = get_pool()
    async with pool.acquire() as conn:
        user = await conn.fetchrow(
            "SELECT id, email, full_name FROM users WHERE email = $1 AND is_active = true",
            payload.email,
        )
        if not user:
            return generic_response

        recent = await conn.fetchrow(
            """
            SELECT created_at FROM password_reset_tokens
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 1
            """,
            user["id"],
        )
        if recent and (datetime.now(timezone.utc) - recent["created_at"]) < settings.PASSWORD_RESET_RESEND_COOLDOWN:
            return generic_response

        raw_token, token_hash = generate_reset_token()
        expires_at = datetime.now(timezone.utc) + settings.PASSWORD_RESET_TOKEN_EXPIRES

        async with conn.transaction():
            await conn.execute(
                "UPDATE password_reset_tokens SET used_at = now() WHERE user_id = $1 AND used_at IS NULL",
                user["id"],
            )
            await conn.execute(
                """
                INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
                VALUES ($1, $2, $3)
                """,
                user["id"],
                token_hash,
                expires_at,
            )

    reset_link = f"{settings.FRONTEND_BASE_URL}/auth/reset-password?token={raw_token}"
    send_password_reset_email(
        to_email=user["email"],
        full_name=user["full_name"],
        reset_link=reset_link,
        expires_minutes=int(settings.PASSWORD_RESET_TOKEN_EXPIRES.total_seconds() // 60),
    )

    return generic_response


@router.post("/reset-password", response_model=ResetPasswordResponse)
async def reset_password(payload: ResetPasswordRequest):
    """
    Consumes a token minted by /auth/forgot-password. The raw token from
    the request is hashed and matched against the stored hash — the raw
    value is never persisted anywhere.
    """
    invalid = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="This reset link is invalid or has expired. Please request a new one.",
    )

    token_hash = hash_reset_token(payload.token)

    pool = get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT id, user_id, expires_at, used_at
            FROM password_reset_tokens
            WHERE token_hash = $1
            """,
            token_hash,
        )

        if not row or row["used_at"] is not None or row["expires_at"] < datetime.now(timezone.utc):
            raise invalid

        async with conn.transaction():
            await conn.execute(
                """
                UPDATE users
                SET password_hash = $1, must_change_password = false, updated_at = now()
                WHERE id = $2
                """,
                hash_password(payload.new_password),
                row["user_id"],
            )
            await conn.execute(
                "UPDATE password_reset_tokens SET used_at = now() WHERE user_id = $1 AND used_at IS NULL",
                row["user_id"],
            )

    return ResetPasswordResponse(message="Your password has been reset. You can now log in with your new password.")