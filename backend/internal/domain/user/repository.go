package user

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

func (r *Repository) Create(u *User) error {
	query := `
		INSERT INTO users (name, email, password_hash)
		VALUES ($1, $2, $3)
		RETURNING id, created_at, updated_at`
	return r.db.QueryRowx(query, u.Name, u.Email, u.PasswordHash).
		Scan(&u.ID, &u.CreatedAt, &u.UpdatedAt)
}

func (r *Repository) GetByEmail(email string) (*User, error) {
	var u User
	query := `SELECT * FROM users WHERE email = $1`
	if err := r.db.Get(&u, query, email); err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	return &u, nil
}

func (r *Repository) GetByID(id string) (*User, error) {
	var u User
	query := `SELECT * FROM users WHERE id = $1`
	if err := r.db.Get(&u, query, id); err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	return &u, nil
}
