from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

OnboardingState = Literal[
    "awaiting_plan", "trialing", "trial_expired", "subscribed", "self_host_requested"
]
UserRole = Literal["subscriber"]

PINCODE_RE = r"^[0-9]{6}$"


class AddressInput(BaseModel):
    line1: str = Field(min_length=3, max_length=255)
    line2: Optional[str] = Field(default=None, max_length=255)
    city: str = Field(min_length=2, max_length=100)
    state: str = Field(min_length=2, max_length=100)
    pincode: str = Field(pattern=PINCODE_RE)
    country: str = Field(default="India", max_length=100)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class RegisterCompanyRequest(BaseModel):
    # login account — the user sets their own password here now. No
    # temp password is generated or emailed; must_change_password is
    # always false for accounts created this way.
    full_name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=20)
    password: str = Field(min_length=8, max_length=128)

    # company identity
    company_name: str = Field(min_length=2, max_length=200)
    # Accepts either a regular image URL or a base64 data: URL from an
    # in-browser file upload, so the higher limit here (vs. a plain link)
    # is intentional — mirrors products_schemas.ProductCreateRequest.image_url.
    logo_url: Optional[str] = Field(default=None, max_length=6_000_000)
    address: AddressInput

    # Compliance/KYC (GST, PAN, FCO licence) and banking details are still
    # not collected at signup — optional extras filled in later from the
    # profile/dashboard, only required before subscribing to a paid plan.

    @field_validator("company_name", "full_name")
    @classmethod
    def strip_text(cls, v: str) -> str:
        return v.strip()

class CompanyOut(BaseModel):
    id: int
    name: str
    onboarding_state: OnboardingState
    trial_ends_at: Optional[datetime]
    logo_url: Optional[str] = None

class TrialUsage(BaseModel):
    """
    A trial can run out two different ways: the 72-hour window elapses,
    or the product/QR usage caps get hit first. All fields are reported
    together so the frontend can show whichever constraint is actually
    closest, instead of only ever counting down a clock that might not
    be the real bottleneck.
    """
    seconds_remaining: Optional[int] = None
    products_used: int
    products_cap: int
    static_qr_used: int
    static_qr_cap: Optional[int]
    dynamic_qr_used: int
    dynamic_qr_cap: Optional[int]
    limiting_factor: Optional[Literal["time", "products", "static_qr", "dynamic_qr"]] = None
    is_exhausted: bool


class PlanResponse(BaseModel):
    company: CompanyOut
    trial_usage: Optional[TrialUsage] = None

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: UserRole
    must_change_password: bool


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(min_length=1, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


class ChangePasswordResponse(BaseModel):
    message: str
    user: UserOut


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    company: CompanyOut
    user: UserOut

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ForgotPasswordResponse(BaseModel):
    message: str

class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=1, max_length=512)
    new_password: str = Field(min_length=8, max_length=128)

class ResetPasswordResponse(BaseModel):
    message: str


class SelfHostRequestRequest(BaseModel):
    contact_name: str = Field(min_length=2, max_length=150)
    contact_email: EmailStr
    contact_phone: str = Field(min_length=7, max_length=20)
    team_size: Optional[str] = Field(default=None, max_length=50)
    infrastructure_preference: Optional[str] = Field(default=None, max_length=100)
    message: Optional[str] = Field(default=None, max_length=2000)

    @field_validator("contact_name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        return v.strip()


class SelfHostRequestResponse(BaseModel):
    company: CompanyOut
    message: str
