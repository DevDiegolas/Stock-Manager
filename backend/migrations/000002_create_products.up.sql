CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    category        VARCHAR(100) NOT NULL,
    measurement     VARCHAR(100),
    size            VARCHAR(50),
    color           VARCHAR(100) NOT NULL,
    price           NUMERIC(10,2) NOT NULL,
    description     TEXT,
    quantity        INTEGER NOT NULL DEFAULT 0,
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_user_id ON products(user_id);

CREATE TABLE product_photos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    drive_file_id   VARCHAR(500) NOT NULL,
    position        SMALLINT NOT NULL CHECK (position BETWEEN 1 AND 4),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_photos_product_id ON product_photos(product_id);
CREATE UNIQUE INDEX idx_product_photos_unique_pos ON product_photos(product_id, position);
