# AgriQR v2 Backend

FastAPI + PostgreSQL (asyncpg). This pass covers **company registration
only** — auto-login, credentials email, and the data model for the
trial/subscribe choice screen that comes next.

## 1. Database

You already have `agriqr_v2` with the base schema applied (matches
`migrations/001_agriqr_v2_schema.sql` — this is the same schema, kept here
so the project is self-contained / reproducible from scratch elsewhere).

Apply migration 002, which this pass's registration endpoint depends on:

```bash
psql -U postgres -d agriqr_v2 -f migrations/002_onboarding_state_and_password.sql
```

This:
- makes `companies.trial_started_at` / `trial_ends_at` nullable (trial no
  longer starts automatically at signup)
- adds `companies.onboarding_state` (`awaiting_plan` / `trialing` /
  `trial_expired` / `subscribed`)
- adds `users.must_change_password` (true until the first login forces a
  password change)

If you're setting this up somewhere fresh instead:
```bash
createdb agriqr_v2
psql -U postgres -d agriqr_v2 -f migrations/001_agriqr_v2_schema.sql
psql -U postgres -d agriqr_v2 -f migrations/002_onboarding_state_and_password.sql
```

## 2. Environment

```bash
cp .env.example .env
# edit .env — at minimum set DATABASE_URL to match your local psql setup
# and change JWT_SECRET
```

SMTP is optional for local dev — if `SMTP_HOST` is left blank, the
credentials email is logged to the console instead of sent, so
registration works end-to-end without real mail credentials.

## 3. Run

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Health check: `GET http://localhost:8000/health` → `{"status": "ok"}`

## 4. What's live right now

`POST /auth/company/register`
- body: see `RegisterCompanyRequest` in `app/schemas.py`
  (`full_name`, `email`, `phone`, `password`, `company_name`, `address`,
  plus optional `logo_url`, `gst_number`, `pan_number`,
  `fco_license_number`, `bank_account_no`, `ifsc_code`, `referral_name`)
- creates the address + company (`onboarding_state='awaiting_plan'`) +
  user (`must_change_password=true`) in one transaction
- emails the login credentials
- returns an `AuthResponse` (access + refresh tokens) immediately —
  this is the "auto-login," no separate `/auth/login` call needed right
  after registering
- `409` if the email is already registered

## 5. Not built yet (next passes)

- `POST /auth/login` + `POST /auth/change-password` (forced first-login
  password change)
- `POST /plan/start-trial` / `POST /plan/subscribe` (the choice screen)
- Billing, licenses, products, batches, QR, analytics, SuperAdmin — see
  `agriqr_v2_dev_reference.md` for the full build order.
