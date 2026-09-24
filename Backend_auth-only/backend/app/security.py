from datetime import datetime, timezone

import bcrypt
import jwt
import secrets, string
import hashlib
from .config import settings

def generate_reset_token() -> tuple[str, str]:
    raw_token = secrets.token_urlsafe(32)
    token_hash = hash_reset_token(raw_token)
    return raw_token, token_hash

def hash_reset_token(raw_token: str) -> str:
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))



def _create_token(subject: str, company_id: str, role: str, expires_delta, token_type: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "company_id": company_id,
        "role": role,
        "type": token_type,
        "iat": now,
        "exp": now + expires_delta,
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_access_token(user_id: int, company_id: int, role: str) -> str:
    return _create_token(str(user_id), str(company_id), role, settings.ACCESS_TOKEN_EXPIRES, "access")


def create_refresh_token(user_id: int, company_id: int, role: str) -> str:
    return _create_token(str(user_id), str(company_id), role, settings.REFRESH_TOKEN_EXPIRES, "refresh")


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])

def generate_temp_password(length: int = 10) -> str:
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))

# --- Platform admin tokens ---------------------------------------------
# Separate token_type ("admin_access"/"admin_refresh") from the tenant
# tokens ("access"/"refresh") is the whole security boundary here: even
# if a company user's JWT leaked, decode_token() would happily parse it,
# but admin_deps.get_current_admin() rejects anything whose "type" isn't
# exactly "admin_access". company_id is a placeholder "0" since admins
# aren't scoped to one — never read that claim for an admin token.
def create_admin_access_token(admin_id: int) -> str:
    return _create_token(str(admin_id), "0", "superadmin", settings.ACCESS_TOKEN_EXPIRES, "admin_access")


def create_admin_refresh_token(admin_id: int) -> str:
    return _create_token(str(admin_id), "0", "superadmin", settings.REFRESH_TOKEN_EXPIRES, "admin_refresh")