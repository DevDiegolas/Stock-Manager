package catalog

import (
	"crypto/rand"
	"fmt"
	"math/big"

	"github.com/jmoiron/sqlx"
)

const slugChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

type Repository struct {
	db *sqlx.DB
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{db: db}
}

func generateSlug() string {
	slug := make([]byte, 8)
	for i := range slug {
		n, _ := rand.Int(rand.Reader, big.NewInt(int64(len(slugChars))))
		slug[i] = slugChars[n.Int64()]
	}
	return string(slug)
}

func (r *Repository) GetByUserID(userID string) (*CatalogSettings, error) {
	var s CatalogSettings
	query := `SELECT * FROM catalog_settings WHERE user_id = $1`
	if err := r.db.Get(&s, query, userID); err != nil {
		return nil, fmt.Errorf("catalog settings not found: %w", err)
	}
	return &s, nil
}

func (r *Repository) GetBySlug(slug string) (*CatalogSettings, error) {
	var s CatalogSettings
	query := `SELECT * FROM catalog_settings WHERE slug = $1 AND active = TRUE`
	if err := r.db.Get(&s, query, slug); err != nil {
		return nil, fmt.Errorf("catalog not found: %w", err)
	}
	return &s, nil
}

func (r *Repository) Upsert(userID string, req UpdateSettingsRequest) (*CatalogSettings, error) {
	slug := generateSlug()

	query := `
		INSERT INTO catalog_settings (user_id, slug, store_name, whatsapp, instagram, active)
		VALUES ($1, $2, COALESCE($3, ''), COALESCE($4, ''), COALESCE($5, ''), TRUE)
		ON CONFLICT (user_id) DO UPDATE SET
			store_name = COALESCE($3, catalog_settings.store_name),
			whatsapp   = COALESCE($4, catalog_settings.whatsapp),
			instagram  = COALESCE($5, catalog_settings.instagram),
			active     = TRUE,
			updated_at = NOW()
		RETURNING *`

	var s CatalogSettings
	err := r.db.Get(&s, query, userID, slug, req.StoreName, req.Whatsapp, req.Instagram)
	if err != nil {
		return nil, fmt.Errorf("failed to save catalog settings: %w", err)
	}
	return &s, nil
}
