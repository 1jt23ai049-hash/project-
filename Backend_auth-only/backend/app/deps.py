"""
Shared dependency for protected routers (products, batches, QR,
analytics, billing, plan, ...).

Real auth is now wired up end-to-end: the frontend sends the JWT access
token issued by /auth/login or /auth/company/register as a Bearer
header, and get_current_user() below verifies it and loads the calling
user's row (scoped to their own company_id) on every request.

There is no bypass mode any more — every protected route requires a
valid, unexpired access token for an active user in a non-suspended
company.
"""
from typing import Optional

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .db import get_pool
from .security import decode_token

bearer_scheme = HTTPBearer(auto_error=False)


class CurrentUser:
    __slots__ = ("user_id", "company_id", "role", "full_name", "email")

    def __init__(self, user_id: int, company_id: int, role: str, full_name: str, email: str):
        self.user_id = user_id
        self.company_id = company_id
        self.role = role
        self.full_name = full_name
        self.email = email


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> CurrentUser:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated.")

    try:
        payload = decode_token(credentials.credentials)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired, please log in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token.")

    if payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type.")

    try:
        user_id = int(payload["sub"])
        company_id = int(payload["company_id"])
    except (KeyError, ValueError, TypeError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Malformed token.")

    pool = get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT u.id, u.company_id, u.role, u.full_name, u.email, u.is_active,
                   c.account_status
            FROM users u
            JOIN companies c ON c.company_id = u.company_id
            WHERE u.id = $1
            """,
            user_id,
        )

    if row is None or not row["is_active"] or row["company_id"] != company_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account no longer valid.")

    if row["account_status"] == "suspended":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This company account is suspended.")

    return CurrentUser(
        user_id=row["id"],
        company_id=row["company_id"],
        role=row["role"],
        full_name=row["full_name"],
        email=row["email"],
    )
