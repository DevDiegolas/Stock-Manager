package history

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

type Repository struct {
	db *sqlx.DB
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Create(e *Entry) error {
	query := `
		INSERT INTO history (user_id, product_id, action, details)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at`
	return r.db.QueryRowx(query, e.UserID, e.ProductID, e.Action, e.Details).
		Scan(&e.ID, &e.CreatedAt)
}

func (r *Repository) List(userID string, params ListParams) (*ListResponse, error) {
	if params.Page < 1 {
		params.Page = 1
	}
	if params.Limit < 1 || params.Limit > 100 {
		params.Limit = 20
	}
	offset := (params.Page - 1) * params.Limit

	var total int
	var entries []Entry

	if params.ProductID != "" {
		countQuery := `SELECT COUNT(*) FROM history WHERE user_id = $1 AND product_id = $2`
		if err := r.db.Get(&total, countQuery, userID, params.ProductID); err != nil {
			return nil, fmt.Errorf("failed to count history: %w", err)
		}

		query := `
			SELECT * FROM history
			WHERE user_id = $1 AND product_id = $2
			ORDER BY created_at DESC
			LIMIT $3 OFFSET $4`
		if err := r.db.Select(&entries, query, userID, params.ProductID, params.Limit, offset); err != nil {
			return nil, fmt.Errorf("failed to list history: %w", err)
		}
	} else {
		countQuery := `SELECT COUNT(*) FROM history WHERE user_id = $1`
		if err := r.db.Get(&total, countQuery, userID); err != nil {
			return nil, fmt.Errorf("failed to count history: %w", err)
		}

		query := `
			SELECT * FROM history
			WHERE user_id = $1
			ORDER BY created_at DESC
			LIMIT $2 OFFSET $3`
		if err := r.db.Select(&entries, query, userID, params.Limit, offset); err != nil {
			return nil, fmt.Errorf("failed to list history: %w", err)
		}
	}

	if entries == nil {
		entries = []Entry{}
	}

	return &ListResponse{
		Entries: entries,
		Total:   total,
		Page:    params.Page,
		Limit:   params.Limit,
	}, nil
}
