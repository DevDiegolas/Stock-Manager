package product

import (
	"encoding/json"
	"fmt"

	"github.com/DevDiegolas/Stock-Manager/backend/internal/domain/history"
)

type Service struct {
	repo        *Repository
	historyRepo *history.Repository
}

func NewService(repo *Repository, historyRepo *history.Repository) *Service {
	return &Service{repo: repo, historyRepo: historyRepo}
}

func (s *Service) Create(userID string, req CreateProductRequest) (*Product, error) {
	if req.Name == "" || req.Color == "" || req.Category == "" {
		return nil, fmt.Errorf("name, category and color are required")
	}
	if req.Price < 0 {
		return nil, fmt.Errorf("price must be positive")
	}
	if req.Quantity < 0 {
		return nil, fmt.Errorf("quantity must be positive")
	}

	p := &Product{
		UserID:      userID,
		Name:        req.Name,
		Category:    req.Category,
		Measurement: req.Measurement,
		Size:        req.Size,
		Color:       req.Color,
		Price:       req.Price,
		Description: req.Description,
		Quantity:    req.Quantity,
	}

	if err := s.repo.Create(p); err != nil {
		return nil, fmt.Errorf("failed to create product: %w", err)
	}

	s.recordHistory(userID, p.ID, "PRODUCT_CREATED", map[string]interface{}{
		"name":     p.Name,
		"category": p.Category,
		"quantity": p.Quantity,
	})

	// Attach photos if provided
	for _, photoReq := range req.Photos {
		if photoReq.DriveFileID == "" || photoReq.Position < 1 || photoReq.Position > 4 {
			continue
		}
		photo := &ProductPhoto{
			ProductID:   p.ID,
			DriveFileID: photoReq.DriveFileID,
			Position:    photoReq.Position,
		}
		s.repo.AddPhoto(photo)
	}

	if len(req.Photos) > 0 {
		photos, _ := s.repo.GetPhotos(p.ID)
		p.Photos = photos
	}

	return p, nil
}

func (s *Service) GetByID(id, userID string) (*Product, error) {
	return s.repo.GetByID(id, userID)
}

func (s *Service) List(userID string, params ListParams) (*ListResponse, error) {
	return s.repo.List(userID, params)
}

func (s *Service) Update(id, userID string, req UpdateProductRequest) (*Product, error) {
	existing, err := s.repo.GetByID(id, userID)
	if err != nil {
		return nil, err
	}

	changes := map[string]interface{}{}

	if req.Name != nil && *req.Name != existing.Name {
		changes["name"] = map[string]string{"old": existing.Name, "new": *req.Name}
		existing.Name = *req.Name
	}
	if req.Category != nil && *req.Category != existing.Category {
		changes["category"] = map[string]string{"old": existing.Category, "new": *req.Category}
		existing.Category = *req.Category
	}
	if req.Color != nil && *req.Color != existing.Color {
		changes["color"] = map[string]string{"old": existing.Color, "new": *req.Color}
		existing.Color = *req.Color
	}
	if req.Price != nil && *req.Price != existing.Price {
		changes["price"] = map[string]interface{}{"old": existing.Price, "new": *req.Price}
		existing.Price = *req.Price
	}
	if req.Measurement != nil {
		existing.Measurement = req.Measurement
		changes["measurement"] = map[string]interface{}{"new": *req.Measurement}
	}
	if req.Size != nil {
		existing.Size = req.Size
		changes["size"] = map[string]interface{}{"new": *req.Size}
	}
	if req.Description != nil {
		existing.Description = req.Description
		changes["description"] = map[string]interface{}{"new": *req.Description}
	}

	if err := s.repo.Update(existing); err != nil {
		return nil, fmt.Errorf("failed to update product: %w", err)
	}

	if len(changes) > 0 {
		s.recordHistory(userID, id, "PRODUCT_UPDATED", changes)
	}

	return existing, nil
}

func (s *Service) Delete(id, userID string) error {
	p, err := s.repo.GetByID(id, userID)
	if err != nil {
		return err
	}

	if err := s.repo.HardDelete(id, userID); err != nil {
		return fmt.Errorf("failed to delete product: %w", err)
	}

	s.recordHistory(userID, id, "PRODUCT_DELETED", map[string]interface{}{
		"name": p.Name,
	})

	return nil
}

func (s *Service) ToggleActive(id, userID string) (*Product, error) {
	p, err := s.repo.GetByID(id, userID)
	if err != nil {
		return nil, err
	}

	newActive := !p.Active
	if err := s.repo.ToggleActive(id, userID, newActive); err != nil {
		return nil, fmt.Errorf("failed to toggle active: %w", err)
	}

	action := "PRODUCT_ACTIVATED"
	if !newActive {
		action = "PRODUCT_DEACTIVATED"
	}
	s.recordHistory(userID, id, action, map[string]interface{}{
		"name":   p.Name,
		"active": newActive,
	})

	p.Active = newActive
	return p, nil
}

func (s *Service) AdjustQuantity(id, userID string, req AdjustQuantityRequest) (*Product, error) {
	if req.Amount == 0 {
		return nil, fmt.Errorf("amount must be non-zero")
	}

	p, err := s.repo.GetByID(id, userID)
	if err != nil {
		return nil, err
	}

	newQty := p.Quantity + req.Amount
	if newQty < 0 {
		return nil, fmt.Errorf("insufficient quantity (current: %d, requested: %d)", p.Quantity, req.Amount)
	}

	if err := s.repo.UpdateQuantity(id, userID, newQty); err != nil {
		return nil, fmt.Errorf("failed to update quantity: %w", err)
	}

	action := "QUANTITY_ADDED"
	if req.Amount < 0 {
		action = "QUANTITY_REMOVED"
	}
	s.recordHistory(userID, id, action, map[string]interface{}{
		"amount":   req.Amount,
		"previous": p.Quantity,
		"new":      newQty,
		"reason":   req.Reason,
	})

	p.Quantity = newQty
	return p, nil
}

func (s *Service) AddPhoto(productID, userID string, req AddPhotoRequest) (*ProductPhoto, error) {
	if _, err := s.repo.GetByID(productID, userID); err != nil {
		return nil, err
	}

	if req.Position < 1 || req.Position > 4 {
		return nil, fmt.Errorf("position must be between 1 and 4")
	}

	count, err := s.repo.CountPhotos(productID)
	if err != nil {
		return nil, err
	}
	if count >= 4 {
		return nil, fmt.Errorf("maximum of 4 photos per product")
	}

	photo := &ProductPhoto{
		ProductID:   productID,
		DriveFileID: req.DriveFileID,
		Position:    req.Position,
	}

	if err := s.repo.AddPhoto(photo); err != nil {
		return nil, fmt.Errorf("failed to add photo: %w", err)
	}

	return photo, nil
}

func (s *Service) DeletePhoto(photoID, productID, userID string) error {
	if _, err := s.repo.GetByID(productID, userID); err != nil {
		return err
	}
	return s.repo.DeletePhoto(photoID, productID)
}

func (s *Service) recordHistory(userID, productID, action string, details map[string]interface{}) {
	detailsJSON, _ := json.Marshal(details)
	s.historyRepo.Create(&history.Entry{
		UserID:    userID,
		ProductID: &productID,
		Action:    action,
		Details:   detailsJSON,
	})
}
