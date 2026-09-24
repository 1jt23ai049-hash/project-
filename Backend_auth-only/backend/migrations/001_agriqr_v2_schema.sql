-- ============================================================================
-- AgriQR v2 — Full Database Schema
-- SuperAdmin platform + per-SKU licensing + trial/paid subscription model
-- PostgreSQL 16+
--
-- This is a complete, standalone script — safe to run top to bottom on a
-- fresh database. Production units / unit_user role are intentionally
-- NOT included (dropped per current requirements); see the note near the
-- `users` table for how to add them back later without touching anything
-- else.
-- ============================================================================

BEGIN;

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE account_status   AS ENUM ('active', 'suspended');
CREATE TYPE user_role        AS ENUM ('subscriber');
CREATE TYPE product_category AS ENUM ('biostimulant', 'insecticide', 'pesticide', 'seed', 'other');
CREATE TYPE license_type     AS ENUM ('trial', 'paid');
CREATE TYPE license_status   AS ENUM ('pending_assignment', 'active', 'expired', 'cancelled');
CREATE TYPE invoice_status   AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE qr_type          AS ENUM ('static', 'dynamic');
CREATE TYPE qr_status        AS ENUM ('active', 'inactive');

-- ============================================================
-- PLATFORM ADMINS  (superadmin logins — not scoped to a company)
-- ============================================================
CREATE TABLE platform_admins (
    id            BIGSERIAL PRIMARY KEY,
    email         CITEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name     TEXT NOT NULL,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ADDRESSES
-- ============================================================
CREATE TABLE addresses (
    address_id BIGSERIAL PRIMARY KEY,
    line1      VARCHAR(255) NOT NULL,
    line2      VARCHAR(255),
    city       VARCHAR(100) NOT NULL,
    state      VARCHAR(100) NOT NULL,
    pincode    VARCHAR(10)  NOT NULL,
    country    VARCHAR(100) NOT NULL DEFAULT 'India',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- COMPANIES
-- ============================================================
CREATE TABLE companies (
    company_id          BIGSERIAL PRIMARY KEY,
    company_name        VARCHAR(255) NOT NULL,
    email                CITEXT NOT NULL UNIQUE,
    mobile_number        VARCHAR(15) NOT NULL,
    address_id           BIGINT REFERENCES addresses(address_id),
    gst_number           VARCHAR(15),
    pan_number           VARCHAR(10),
    fco_license_number   VARCHAR(50),                 -- manufacturing licence under FCO 1985
    bank_account_no      VARCHAR(30),
    ifsc_code            VARCHAR(11),
    referral_name        VARCHAR(150),
    logo_url             TEXT,
    is_verified          BOOLEAN NOT NULL DEFAULT FALSE,        -- superadmin KYC sign-off
    account_status       account_status NOT NULL DEFAULT 'active',  -- superadmin suspend/activate
    trial_started_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    trial_ends_at        TIMESTAMPTZ NOT NULL,                  -- trial_started_at + 3 days
    max_users            INTEGER NOT NULL DEFAULT 1 CHECK (max_users >= 1),  -- seat cap; 1 today, raise anytime
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_companies_address_id ON companies(address_id);

-- ============================================================
-- USERS  (one subscriber per company today; role kept multi-user-ready)
--
-- Production units / unit_user were dropped for now. To bring them back
-- later without touching anything else already built:
--   CREATE TABLE production_units (
--       unit_id BIGSERIAL PRIMARY KEY,
--       company_id BIGINT NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
--       name VARCHAR(200) NOT NULL, location VARCHAR(255), is_active BOOLEAN NOT NULL DEFAULT TRUE,
--       created_by BIGINT REFERENCES users(id),
--       created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
--       UNIQUE (company_id, name)
--   );
--   ALTER TYPE user_role ADD VALUE 'unit_user';
--   ALTER TABLE users   ADD COLUMN production_unit_id BIGINT REFERENCES production_units(unit_id) ON DELETE SET NULL;
--   ALTER TABLE batches ADD COLUMN production_unit_id BIGINT REFERENCES production_units(unit_id) ON DELETE CASCADE;
-- ============================================================
CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    company_id    BIGINT NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    email         CITEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name     TEXT NOT NULL,
    phone         TEXT,
    role          user_role NOT NULL DEFAULT 'subscriber',
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_users_company_id ON users(company_id);
-- Seat count is a CAP, not a hard single-row constraint: a company gets
-- exactly `companies.max_users` active users (1 by default today).
-- Every user is a 'subscriber' — there's only one role name because
-- there's no behavioral difference between users yet. Enforce the seat
-- cap in the app, at user-creation time:
--   SELECT COUNT(*) FROM users WHERE company_id = $1 AND is_active = true
--   -- reject the insert if this >= companies.max_users
-- If distinct roles are ever needed (e.g. an owner vs. an invited
-- teammate), add values with ALTER TYPE user_role ADD VALUE '...' —
-- purely additive, no data migration needed for existing rows.

-- ============================================================
-- PRODUCTS (SKUs)
-- ============================================================
CREATE TABLE products (
    product_id         BIGSERIAL PRIMARY KEY,
    company_id         BIGINT NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    sku_code           VARCHAR(60) NOT NULL,
    name               VARCHAR(200) NOT NULL,
    category           product_category NOT NULL DEFAULT 'biostimulant',
    brand              VARCHAR(150),
    description        TEXT,
    composition        TEXT,
    unit               VARCHAR(30),
    pack_size          VARCHAR(50),
    mrp                NUMERIC(12,2),
    hsn_code           VARCHAR(20),
    image_url          TEXT,
    is_active          BOOLEAN NOT NULL DEFAULT TRUE,
    regulatory_details JSONB,   -- gazette no./date, composition, crops, dosage — mandatory before static QR
    additional_info    JSONB,   -- optional: notes, safety info, linked docs
    created_by         BIGINT REFERENCES users(id),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (company_id, sku_code)
);
CREATE INDEX idx_products_company_id ON products(company_id);
CREATE INDEX idx_products_category ON products(company_id, category);

-- ============================================================
-- PRICING CONFIG — superadmin-controlled ₹/SKU/year, versioned so past
-- invoices keep the price that was actually charged at the time
-- ============================================================
CREATE TABLE pricing_config (
    id                     BIGSERIAL PRIMARY KEY,
    price_per_sku_per_year NUMERIC(12,2) NOT NULL,
    currency               VARCHAR(3) NOT NULL DEFAULT 'INR',
    effective_from         TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by             BIGINT REFERENCES platform_admins(id),
    created_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INVOICES — a purchase of N SKU-license slots
-- ============================================================
CREATE TABLE invoices (
    invoice_id            BIGSERIAL PRIMARY KEY,
    company_id            BIGINT NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    sku_quantity          INTEGER NOT NULL CHECK (sku_quantity > 0),
    unit_price            NUMERIC(12,2) NOT NULL,     -- snapshot of pricing_config at purchase time
    amount                NUMERIC(12,2) NOT NULL,     -- sku_quantity * unit_price
    currency              VARCHAR(3) NOT NULL DEFAULT 'INR',
    status                invoice_status NOT NULL DEFAULT 'pending',
    gateway               VARCHAR(30) NOT NULL DEFAULT 'razorpay',
    gateway_order_id      TEXT,
    gateway_payment_id    TEXT,
    billing_period_start  DATE,
    billing_period_end    DATE,                        -- start + 1 year, set on payment success
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    paid_at               TIMESTAMPTZ
);
CREATE INDEX idx_invoices_company_id ON invoices(company_id);

-- ============================================================
-- LICENSES — one row per SKU per license period
--   trial : auto-created per product added inside the company's 3-day
--           trial window; capped 2 static + 2 dynamic within 72h
--   paid  : created (unassigned) when an invoice is paid, then assigned
--           to a specific product_id; 1-year validity, unlimited QR caps
-- ============================================================
CREATE TABLE licenses (
    license_id      BIGSERIAL PRIMARY KEY,
    company_id      BIGINT NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    product_id      BIGINT REFERENCES products(product_id) ON DELETE CASCADE,   -- NULL = unassigned paid slot
    invoice_id      BIGINT REFERENCES invoices(invoice_id),                     -- NULL for trial licenses
    license_type    license_type NOT NULL,
    status          license_status NOT NULL DEFAULT 'pending_assignment',
    starts_at       TIMESTAMPTZ,
    ends_at         TIMESTAMPTZ,
    static_qr_cap   INTEGER,      -- NULL = unlimited (paid); trial default 2
    static_qr_used  INTEGER NOT NULL DEFAULT 0,
    dynamic_qr_cap  INTEGER,      -- NULL = unlimited (paid); trial default 2
    dynamic_qr_used INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_license_active_needs_product
        CHECK (status <> 'active' OR product_id IS NOT NULL)
);
CREATE INDEX idx_licenses_company_id ON licenses(company_id);
CREATE INDEX idx_licenses_product_id ON licenses(product_id);
CREATE UNIQUE INDEX uq_licenses_one_active_per_product
    ON licenses(product_id) WHERE status = 'active';

-- ============================================================
-- LICENSE EVENTS — audit trail (trial issued, activated, renewed, expired…)
-- ============================================================
CREATE TABLE license_events (
    id          BIGSERIAL PRIMARY KEY,
    company_id  BIGINT NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    license_id  BIGINT REFERENCES licenses(license_id) ON DELETE SET NULL,
    from_status license_status,
    to_status   license_status NOT NULL,
    note        TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_license_events_company_id ON license_events(company_id);

-- ============================================================
-- BATCHES — required precursor for EVERY QR (static or dynamic).
-- No approval workflow — a batch is simply created and saved by the
-- one user on the account. (If a maker/checker step is ever needed,
-- re-add a status enum + approved_by column then — this table has no
-- dependency that would make that harder later.)
-- ============================================================
CREATE TABLE batches (
    batch_id          BIGSERIAL PRIMARY KEY,
    company_id        BIGINT NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    product_id        BIGINT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    batch_number      VARCHAR(60) NOT NULL,
    manufacture_date  DATE NOT NULL,
    expiry_date       DATE NOT NULL,
    quantity_produced NUMERIC(14,2),
    created_by        BIGINT NOT NULL REFERENCES users(id),
    qr_generated      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_batches_company_id ON batches(company_id);
CREATE INDEX idx_batches_product_id ON batches(product_id);
CREATE UNIQUE INDEX uq_batches_company_product_number
    ON batches(company_id, product_id, upper(batch_number));

-- ============================================================
-- QR CODES — always tied to a batch AND to the license that authorized it
-- ============================================================
CREATE TABLE qr_codes (
    qr_id           BIGSERIAL PRIMARY KEY,
    company_id      BIGINT NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    product_id      BIGINT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    batch_id        BIGINT NOT NULL REFERENCES batches(batch_id) ON DELETE CASCADE,
    license_id      BIGINT NOT NULL REFERENCES licenses(license_id),
    qr_type         qr_type NOT NULL DEFAULT 'static',
    qr_value        TEXT NOT NULL UNIQUE,
    static_payload  JSONB,        -- frozen compliance annexure, static only
    redirect_target TEXT,         -- editable destination, dynamic only
    status          qr_status NOT NULL DEFAULT 'active',
    scan_count      INTEGER NOT NULL DEFAULT 0,
    generated_by    BIGINT REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_qr_codes_company_id ON qr_codes(company_id);
CREATE INDEX idx_qr_codes_product_id ON qr_codes(product_id);
CREATE INDEX idx_qr_codes_type ON qr_codes(company_id, qr_type);
CREATE UNIQUE INDEX uq_qr_codes_batch_id ON qr_codes(batch_id);

-- ============================================================
-- QR SCANS — analytics log (mainly meaningful for dynamic QR; static
-- scans only get logged too if you add an optional /verify redirect)
-- ============================================================
CREATE TABLE qr_scans (
    scan_id    BIGSERIAL PRIMARY KEY,
    qr_id      BIGINT NOT NULL REFERENCES qr_codes(qr_id) ON DELETE CASCADE,
    scanned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ip_address INET,
    city       VARCHAR(100),
    region     VARCHAR(100),
    country    VARCHAR(100),
    user_agent TEXT,
    referrer   TEXT
);
CREATE INDEX idx_qr_scans_qr_id ON qr_scans(qr_id);
CREATE INDEX idx_qr_scans_scanned_at ON qr_scans(scanned_at);

COMMIT;

-- ============================================================================
-- End of schema
-- ============================================================================
