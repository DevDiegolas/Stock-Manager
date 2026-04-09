CREATE TYPE history_action AS ENUM (
    'PRODUCT_CREATED',
    'PRODUCT_UPDATED',
    'PRODUCT_DELETED',
    'QUANTITY_ADDED',
    'QUANTITY_REMOVED'
);

CREATE TABLE history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id      UUID REFERENCES products(id) ON DELETE SET NULL,
    action          history_action NOT NULL,
    details         JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_history_user_id ON history(user_id);
CREATE INDEX idx_history_product_id ON history(product_id);
CREATE INDEX idx_history_created_at ON history(created_at);
