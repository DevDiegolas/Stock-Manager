package history

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) List(userID string, params ListParams) (*ListResponse, error) {
	return s.repo.List(userID, params)
}

func (s *Service) Clear(userID string) error {
	return s.repo.Clear(userID)
}
