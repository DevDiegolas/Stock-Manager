package storage

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type LocalStorage struct {
	baseDir string
}

func NewLocalStorage(baseDir string) (*LocalStorage, error) {
	if err := os.MkdirAll(baseDir, 0o755); err != nil {
		return nil, fmt.Errorf("failed to create storage dir: %w", err)
	}
	return &LocalStorage{baseDir: baseDir}, nil
}

func (s *LocalStorage) SaveProductPhoto(reader io.Reader, originalName string) (string, error) {
	ext := strings.ToLower(filepath.Ext(originalName))
	if ext == "" {
		ext = ".jpg"
	}

	randomPart := make([]byte, 8)
	if _, err := rand.Read(randomPart); err != nil {
		return "", fmt.Errorf("failed to generate file name: %w", err)
	}

	fileName := fmt.Sprintf("products/%d-%s%s", time.Now().UnixNano(), hex.EncodeToString(randomPart), ext)
	fullPath := filepath.Join(s.baseDir, filepath.FromSlash(fileName))

	if err := os.MkdirAll(filepath.Dir(fullPath), 0o755); err != nil {
		return "", fmt.Errorf("failed to create product photo dir: %w", err)
	}

	dst, err := os.Create(fullPath)
	if err != nil {
		return "", fmt.Errorf("failed to create photo file: %w", err)
	}
	defer dst.Close()

	if _, err := io.Copy(dst, reader); err != nil {
		return "", fmt.Errorf("failed to write photo file: %w", err)
	}

	return "/uploads/" + fileName, nil
}

func (s *LocalStorage) DeleteByPublicPath(publicPath string) error {
	if !strings.HasPrefix(publicPath, "/uploads/") {
		return nil
	}

	rel := strings.TrimPrefix(publicPath, "/uploads/")
	if rel == "" || strings.Contains(rel, "..") {
		return fmt.Errorf("invalid file path")
	}

	fullPath := filepath.Join(s.baseDir, filepath.FromSlash(rel))
	if err := os.Remove(fullPath); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("failed to remove photo file: %w", err)
	}

	return nil
}
