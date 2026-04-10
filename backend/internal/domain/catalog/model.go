package catalog

import (
	"time"

	"github.com/DevDiegolas/Stock-Manager/backend/internal/domain/product"
)

type CatalogSettings struct {
	ID        string    `db:"id" json:"id"`
	UserID    string    `db:"user_id" json:"user_id"`
	Slug      string    `db:"slug" json:"slug"`
	StoreName string    `db:"store_name" json:"store_name"`
	Whatsapp  string    `db:"whatsapp" json:"whatsapp"`
	Instagram string    `db:"instagram" json:"instagram"`
	Active    bool      `db:"active" json:"active"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
	UpdatedAt time.Time `db:"updated_at" json:"updated_at"`
}

type UpdateSettingsRequest struct {
	StoreName *string `json:"store_name,omitempty"`
	Whatsapp  *string `json:"whatsapp,omitempty"`
	Instagram *string `json:"instagram,omitempty"`
}

type PublicCatalogResponse struct {
	StoreName string            `json:"store_name"`
	Whatsapp  string            `json:"whatsapp"`
	Instagram string            `json:"instagram"`
	Products  []product.Product `json:"products"`
}
