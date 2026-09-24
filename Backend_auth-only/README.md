# AgriQR — Auth-only test bundle

This is a trimmed copy of the full project containing **only** the files
needed to run and test the four pages currently in scope:

- Signup / Company Registration (`/company/register`)
- Login (`/auth/login`)
- Forgot Password (`/auth/forgot-password`)
- Reset Password (`/auth/reset-password`)

It's meant to be a smaller, easier-to-navigate codebase to point Playwright
at while you're starting out — not a permanent fork. As test coverage
grows to other pages, pull the corresponding files back in from the full
project.

## What's included

**backend/** — FastAPI app wired with only the `auth_router` (register,
login, change-password, forgot-password, reset-password) plus its direct
dependencies: `schemas.py`, `security.py`, `db.py`, `config.py`, `deps.py`,
`email_service.py`. Migrations `001` (base schema), `002` (onboarding
state + password columns), `003` (password reset tokens) — these three
create every table the auth endpoints touch (`companies`, `addresses`,
`users`, `password_reset_tokens`).

**frontend/** — CRA/React app with only the four auth pages
(`Login.tsx`, `CompanyRegister.tsx`, `ForgotPassword.tsx`,
`ResetPassword.tsx`), their shared `AuthLayout.tsx`, the `Logo` component,
`theme/brand.ts`, and the two API clients they call (`lib/api.ts` for the
tenant endpoints, `lib/admin-api.ts` because `Login.tsx` has a built-in
admin-login fallback — see note below). `App.tsx` was rewritten to only
route to these four pages plus a placeholder home page (the real app's
home/dashboard/onboarding/admin pages aren't included).

## Intentionally NOT included

- **Admin router/backend** (`admin_router.py`, `admin_deps.py`,
  `admin_schemas.py`). `Login.tsx` calls `POST /admin/auth/login` as a
  fallback when tenant login 401s (test cases LI-014–LI-016 in the test
  plan). That endpoint isn't wired into this trimmed backend's `main.py`
  — those specific cases need the full backend, or add `admin_router` +
  `admin_deps` + `admin_schemas` back in yourself.
- Dashboard, onboarding, billing, products, batches, analytics, QR,
  verify, and platform-admin routers/pages — all out of scope for this
  test pass, per the test plan.
- `qrcode`/`Pillow` (backend) and everything dashboard-related (frontend)
  since nothing in scope uses them.

## Running it

**Backend**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# create a Postgres DB, then run the 3 migrations in migrations/ in order
# set DATABASE_URL / JWT_SECRET / FRONTEND_BASE_URL as needed (see config.py)
uvicorn app.main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm start
```

Frontend expects the backend at `http://localhost:8000` by default
(`REACT_APP_API_URL` env var to override).
