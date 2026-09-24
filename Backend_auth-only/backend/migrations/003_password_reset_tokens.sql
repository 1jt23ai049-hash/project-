BEGIN;

CREATE TABLE password_reset_tokens (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  CHAR(64) NOT NULL UNIQUE,   -- sha256 hex digest of the raw token
    expires_at  TIMESTAMPTZ NOT NULL,
    used_at     TIMESTAMPTZ,
    requested_ip VARCHAR(45),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_user_created ON password_reset_tokens(user_id, created_at DESC);

COMMIT;