package user

import (
	"fmt"
	"strings"

	"github.com/DevDiegolas/Stock-Manager/backend/internal/platform/auth"
	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	repo       *Repository
	jwtService *auth.JWTService
}

func NewService(repo *Repository, jwtService *auth.JWTService) *Service {
	return &Service{repo: repo, jwtService: jwtService}
}

func (s *Service) Register(req RegisterRequest) (*AuthResponse, error) {
	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	req.Name = strings.TrimSpace(req.Name)

	if req.Name == "" || req.Email == "" || req.Password == "" {
		return nil, fmt.Errorf("name, email and password are required")
	}

	if len(req.Password) < 6 {
		return nil, fmt.Errorf("password must be at least 6 characters")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), 12)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	user := &User{
		Name:         req.Name,
		Email:        req.Email,
		PasswordHash: string(hash),
	}

	if err := s.repo.Create(user); err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			return nil, fmt.Errorf("email already registered")
		}
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	token, err := s.jwtService.GenerateToken(user.ID, user.Email)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token: %w", err)
	}

	return &AuthResponse{Token: token, User: *user}, nil
}

func (s *Service) Login(req LoginRequest) (*AuthResponse, error) {
	req.Email = strings.TrimSpace(strings.ToLower(req.Email))

	if req.Email == "" || req.Password == "" {
		return nil, fmt.Errorf("email and password are required")
	}

	user, err := s.repo.GetByEmail(req.Email)
	if err != nil {
		return nil, fmt.Errorf("invalid email or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, fmt.Errorf("invalid email or password")
	}

	token, err := s.jwtService.GenerateToken(user.ID, user.Email)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token: %w", err)
	}

	return &AuthResponse{Token: token, User: *user}, nil
}

func (s *Service) GetByID(id string) (*User, error) {
	return s.repo.GetByID(id)
}
