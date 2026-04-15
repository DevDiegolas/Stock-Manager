package product

import (
	"fmt"
	"strings"

	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

type Repository struct {
	db *sqlx.DB
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Create(p *Product) error {
	query := `
		INSERT INTO products (user_id, name, category, measurement, size, color, price, description, quantity)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, active, created_at, updated_at`
	return r.db.QueryRowx(query,
		p.UserID, p.Name, p.Category, p.Measurement, p.Size,
		p.Color, p.Price, p.Description, p.Quantity,
	).Scan(&p.ID, &p.Active, &p.CreatedAt, &p.UpdatedAt)
}

func (r *Repository) GetByID(id, userID string) (*Product, error) {
	var p Product
	query := `SELECT * FROM products WHERE id = $1 AND user_id = $2`
	if err := r.db.Get(&p, query, id, userID); err != nil {
		return nil, fmt.Errorf("product not found: %w", err)
	}

	photos, err := r.GetPhotos(id)
	if err == nil {
		p.Photos = photos
	}

	return &p, nil
}

func (r *Repository) List(userID string, params ListParams) (*ListResponse, error) {
	where := []string{"user_id = $1"}
	args := []interface{}{userID}
	argIdx := 2

	if params.Category != "" {
		where = append(where, fmt.Sprintf("category = $%d", argIdx))
		args = append(args, params.Category)
		argIdx++
	}

	if params.Search != "" {
		where = append(where, fmt.Sprintf("name ILIKE $%d", argIdx))
		args = append(args, "%"+params.Search+"%")
		argIdx++
	}

	if params.Active != nil {
		where = append(where, fmt.Sprintf("active = $%d", argIdx))
		args = append(args, *params.Active)
		argIdx++
	}

	whereClause := strings.Join(where, " AND ")

	var total int
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM products WHERE %s", whereClause)
	if err := r.db.Get(&total, countQuery, args...); err != nil {
		return nil, fmt.Errorf("failed to count products: %w", err)
	}

	if params.Page < 1 {
		params.Page = 1
	}
	if params.Limit < 1 || params.Limit > 100 {
		params.Limit = 20
	}
	offset := (params.Page - 1) * params.Limit

	query := fmt.Sprintf(`
		SELECT * FROM products WHERE %s
		ORDER BY created_at DESC
		LIMIT $%d OFFSET $%d`,
		whereClause, argIdx, argIdx+1)
	args = append(args, params.Limit, offset)

	var products []Product
	if err := r.db.Select(&products, query, args...); err != nil {
		return nil, fmt.Errorf("failed to list products: %w", err)
	}

	if products == nil {
		products = []Product{}
	}

	return &ListResponse{
		Products: products,
		Total:    total,
		Page:     params.Page,
		Limit:    params.Limit,
	}, nil
}

func (r *Repository) Update(p *Product) error {
	query := `
		UPDATE products
		SET name = $1, category = $2, measurement = $3, size = $4,
		    color = $5, price = $6, description = $7, updated_at = NOW()
		WHERE id = $8 AND user_id = $9
		RETURNING updated_at`
	return r.db.QueryRowx(query,
		p.Name, p.Category, p.Measurement, p.Size,
		p.Color, p.Price, p.Description, p.ID, p.UserID,
	).Scan(&p.UpdatedAt)
}

func (r *Repository) UpdateQuantity(id, userID string, quantity int) error {
	query := `UPDATE products SET quantity = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3`
	_, err := r.db.Exec(query, quantity, id, userID)
	return err
}

func (r *Repository) HardDelete(id, userID string) error {
	_, err := r.db.Exec(`DELETE FROM product_photos WHERE product_id = $1`, id)
	if err != nil {
		return err
	}
	_, err = r.db.Exec(`DELETE FROM products WHERE id = $1 AND user_id = $2`, id, userID)
	return err
}

func (r *Repository) ToggleActive(id, userID string, active bool) error {
	query := `UPDATE products SET active = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3`
	_, err := r.db.Exec(query, active, id, userID)
	return err
}

func (r *Repository) GetPhotos(productID string) ([]ProductPhoto, error) {
	var photos []ProductPhoto
	query := `SELECT * FROM product_photos WHERE product_id = $1 ORDER BY position`
	if err := r.db.Select(&photos, query, productID); err != nil {
		return nil, err
	}
	if photos == nil {
		photos = []ProductPhoto{}
	}
	return photos, nil
}

func (r *Repository) AddPhoto(photo *ProductPhoto) error {
	query := `
		INSERT INTO product_photos (product_id, drive_file_id, position)
		VALUES ($1, $2, $3)
		RETURNING id, created_at`
	return r.db.QueryRowx(query, photo.ProductID, photo.DriveFileID, photo.Position).
		Scan(&photo.ID, &photo.CreatedAt)
}

func (r *Repository) DeletePhoto(photoID, productID string) error {
	query := `DELETE FROM product_photos WHERE id = $1 AND product_id = $2`
	_, err := r.db.Exec(query, photoID, productID)
	return err
}

func (r *Repository) GetPhotoByID(photoID, productID string) (*ProductPhoto, error) {
	var photo ProductPhoto
	query := `SELECT * FROM product_photos WHERE id = $1 AND product_id = $2`
	if err := r.db.Get(&photo, query, photoID, productID); err != nil {
		return nil, err
	}

	return &photo, nil
}

func (r *Repository) CountPhotos(productID string) (int, error) {
	var count int
	query := `SELECT COUNT(*) FROM product_photos WHERE product_id = $1`
	err := r.db.Get(&count, query, productID)
	return count, err
}

func (r *Repository) GetPhotosByProductIDs(ids []string) (map[string][]ProductPhoto, error) {
	if len(ids) == 0 {
		return map[string][]ProductPhoto{}, nil
	}

	query := `SELECT * FROM product_photos WHERE product_id = ANY($1) ORDER BY position`
	var photos []ProductPhoto
	if err := r.db.Select(&photos, query, pq.Array(ids)); err != nil {
		return nil, fmt.Errorf("failed to load photos: %w", err)
	}

	result := make(map[string][]ProductPhoto)
	for _, p := range photos {
		result[p.ProductID] = append(result[p.ProductID], p)
	}
	return result, nil
}
