package config

import "os"

type Config struct {
	DatabaseURL string
	JWTSecret   string
	ServerPort  string
	UploadDir   string
}

func Load() *Config {
	return &Config{
		DatabaseURL: getEnv("DATABASE_URL", "postgres://stockmanager:changeme@db:5432/stockmanager?sslmode=disable"),
		JWTSecret:   getEnv("JWT_SECRET", "change-this-to-a-random-secret-key"),
		ServerPort:  getEnv("SERVER_PORT", "8080"),
		UploadDir:   getEnv("UPLOAD_DIR", "./uploads"),
	}
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
