-- ============================================================================
-- AgriQR v2 — migration 002
-- Decouples trial start from registration, and adds the forced
-- first-login password change. Run this against the agriqr_v2 database
-- created from 001_agriqr_v2_schema.sql.
--
-- Safe to run once. Re-running will fail on the CREATE TYPE / ADD COLUMN
-- statements (Postgres has no IF NOT EXISTS for enum types) — that's
-- expected, it just means it already ran.
-- ============================================================================

BEGIN;

-- Trial no longer starts automatically at signup — it starts only when
-- the company explicitly picks "Start Free Trial" (POST /plan/start-trial,
-- not built yet). Registration leaves both columns NULL.
ALTER TABLE companies
    ALTER COLUMN trial_started_at DROP DEFAULT,
    ALTER COLUMN trial_started_at DROP NOT NULL,
    ALTER COLUMN trial_ends_at   DROP NOT NULL;

-- Tracks which stage of onboarding a company is in. Registration sets
-- this to 'awaiting_plan' and stops there; later stages are set by the
-- plan-selection and billing endpoints as they're built.
CREATE TYPE onboarding_state AS ENUM (
    'awaiting_plan',   -- registered, hasn't chosen trial or subscribe yet
    'trialing',        -- trial active, within the 72h window
    'trial_expired',   -- 72h passed, never subscribed
    'subscribed'       -- has at least one paid invoice / active paid license
);
ALTER TABLE companies
    ADD COLUMN onboarding_state onboarding_state NOT NULL DEFAULT 'awaiting_plan';

-- The password set at registration is a one-time default: true until the
-- first login forces a change, then flipped false by
-- POST /auth/change-password (not built yet).
ALTER TABLE users
    ADD COLUMN must_change_password BOOLEAN NOT NULL DEFAULT TRUE;

COMMIT;
