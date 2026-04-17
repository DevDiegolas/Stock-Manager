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

type PublicProductPhoto struct {
	ID          string `json:"id"`
	DriveFileID string `json:"drive_file_id"`
	Position    int    `json:"position"`
}

type PublicProduct struct {
	ID          string               `json:"id"`
	Name        string               `json:"name"`
	Category    string               `json:"category"`
	Measurement *string              `json:"measurement,omitempty"`
	Size        *string              `json:"size,omitempty"`
	Color       string               `json:"color"`
	Price       float64              `json:"price"`
	Quantity    int                  `json:"quantity"`
	Photos      []PublicProductPhoto `json:"photos,omitempty"`
}

type PublicCatalogResponse struct {
	StoreName string          `json:"store_name"`
	Whatsapp  string          `json:"whatsapp"`
	Instagram string          `json:"instagram"`
	Products  []PublicProduct `json:"products"`
}

func toPublicProduct(p product.Product) PublicProduct {
	photos := make([]PublicProductPhoto, 0, len(p.Photos))
	for _, ph := range p.Photos {
		photos = append(photos, PublicProductPhoto{
			ID:          ph.ID,
			DriveFileID: ph.DriveFileID,
			Position:    ph.Position,
		})
	}
	return PublicProduct{
		ID:          p.ID,
		Name:        p.Name,
		Category:    p.Category,
		Measurement: p.Measurement,
		Size:        p.Size,
		Color:       p.Color,
		Price:       p.Price,
		Quantity:    p.Quantity,
		Photos:      photos,
	}
}
