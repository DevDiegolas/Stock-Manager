CREATE TABLE catalog_settings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    slug        VARCHAR(20) NOT NULL UNIQUE,
    store_name  VARCHAR(255) NOT NULL DEFAULT '',
    whatsapp    VARCHAR(20) NOT NULL DEFAULT '',
    instagram   VARCHAR(255) NOT NULL DEFAULT '',
    active      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
