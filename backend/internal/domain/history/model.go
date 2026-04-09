package history

import (
	"encoding/json"
	"time"
)

type Entry struct {
	ID        string          `db:"id" json:"id"`
	UserID    string          `db:"user_id" json:"user_id"`
	ProductID *string         `db:"product_id" json:"product_id,omitempty"`
	Action    string          `db:"action" json:"action"`
	Details   json.RawMessage `db:"details" json:"details,omitempty"`
	CreatedAt time.Time       `db:"created_at" json:"created_at"`
}

type ListParams struct {
	Page      int    `json:"page"`
	Limit     int    `json:"limit"`
	ProductID string `json:"product_id"`
}

type ListResponse struct {
	Entries []Entry `json:"entries"`
	Total   int     `json:"total"`
	Page    int     `json:"page"`
	Limit   int     `json:"limit"`
}
