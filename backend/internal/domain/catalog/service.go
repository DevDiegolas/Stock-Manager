package catalog

import (
	"fmt"

	"github.com/DevDiegolas/Stock-Manager/backend/internal/domain/product"
)

type Service struct {
	repo        *Repository
	productRepo *product.Repository
}

func NewService(repo *Repository, productRepo *product.Repository) *Service {
	return &Service{repo: repo, productRepo: productRepo}
}

func (s *Service) GetSettings(userID string) (*CatalogSettings, error) {
	settings, err := s.repo.GetByUserID(userID)
	if err != nil {
		// Return empty defaults if no settings exist yet
		return &CatalogSettings{
			UserID:    userID,
			StoreName: "",
			Whatsapp:  "",
			Instagram: "",
			Active:    false,
		}, nil
	}
	return settings, nil
}

func (s *Service) SaveSettings(userID string, req UpdateSettingsRequest) (*CatalogSettings, error) {
	return s.repo.Upsert(userID, req)
}

func (s *Service) GetPublicCatalog(slug string) (*PublicCatalogResponse, error) {
	settings, err := s.repo.GetBySlug(slug)
	if err != nil {
		return nil, fmt.Errorf("catalog not found")
	}

	active := true
	listResp, err := s.productRepo.List(settings.UserID, product.ListParams{
		Active: &active,
		Limit:  100,
		Page:   1,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to load products: %w", err)
	}

	// Batch load photos for all products
	ids := make([]string, len(listResp.Products))
	for i, p := range listResp.Products {
		ids[i] = p.ID
	}

	photosMap, err := s.productRepo.GetPhotosByProductIDs(ids)
	if err != nil {
		return nil, fmt.Errorf("failed to load photos: %w", err)
	}

	for i := range listResp.Products {
		if photos, ok := photosMap[listResp.Products[i].ID]; ok {
			listResp.Products[i].Photos = photos
		}
	}

	publicProducts := make([]PublicProduct, len(listResp.Products))
	for i, p := range listResp.Products {
		publicProducts[i] = toPublicProduct(p)
	}

	return &PublicCatalogResponse{
		StoreName: settings.StoreName,
		Whatsapp:  settings.Whatsapp,
		Instagram: settings.Instagram,
		Products:  publicProducts,
	}, nil
}
