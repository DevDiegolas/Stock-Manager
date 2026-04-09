package product

import "time"

type Product struct {
	ID          string         `db:"id" json:"id"`
	UserID      string         `db:"user_id" json:"user_id"`
	Name        string         `db:"name" json:"name"`
	Category    string         `db:"category" json:"category"`
	Measurement *string        `db:"measurement" json:"measurement,omitempty"`
	Size        *string        `db:"size" json:"size,omitempty"`
	Color       string         `db:"color" json:"color"`
	Price       float64        `db:"price" json:"price"`
	Description *string        `db:"description" json:"description,omitempty"`
	Quantity    int            `db:"quantity" json:"quantity"`
	Active      bool           `db:"active" json:"active"`
	CreatedAt   time.Time      `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time      `db:"updated_at" json:"updated_at"`
	Photos      []ProductPhoto `json:"photos,omitempty"`
}

type ProductPhoto struct {
	ID          string    `db:"id" json:"id"`
	ProductID   string    `db:"product_id" json:"product_id"`
	DriveFileID string    `db:"drive_file_id" json:"drive_file_id"`
	Position    int       `db:"position" json:"position"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
}

type CreateProductRequest struct {
	Name        string            `json:"name"`
	Category    string            `json:"category"`
	Measurement *string           `json:"measurement,omitempty"`
	Size        *string           `json:"size,omitempty"`
	Color       string            `json:"color"`
	Price       float64           `json:"price"`
	Description *string           `json:"description,omitempty"`
	Quantity    int               `json:"quantity"`
	Photos      []AddPhotoRequest `json:"photos,omitempty"`
}

type UpdateProductRequest struct {
	Name        *string  `json:"name,omitempty"`
	Category    *string  `json:"category,omitempty"`
	Measurement *string  `json:"measurement,omitempty"`
	Size        *string  `json:"size,omitempty"`
	Color       *string  `json:"color,omitempty"`
	Price       *float64 `json:"price,omitempty"`
	Description *string  `json:"description,omitempty"`
}

type AdjustQuantityRequest struct {
	Amount int    `json:"amount"`
	Reason string `json:"reason"`
}

type AddPhotoRequest struct {
	DriveFileID string `json:"drive_file_id"`
	Position    int    `json:"position"`
}

type ListParams struct {
	Page     int    `json:"page"`
	Limit    int    `json:"limit"`
	Category string `json:"category"`
	Search   string `json:"search"`
	Active   *bool  `json:"active"`
}

type ListResponse struct {
	Products []Product `json:"products"`
	Total    int       `json:"total"`
	Page     int       `json:"page"`
	Limit    int       `json:"limit"`
}
