package config

import (
	"log"
	"os"
)

const defaultJWTSecret = "change-this-to-a-random-secret-key"

type Config struct {
	DatabaseURL string
	JWTSecret   string
	ServerPort  string
	UploadDir   string
}

func Load() *Config {
	jwtSecret := getEnv("JWT_SECRET", defaultJWTSecret)
	if jwtSecret == defaultJWTSecret {
		log.Fatal("JWT_SECRET must be set to a strong random value (current value is the insecure default)")
	}
	if len(jwtSecret) < 32 {
		log.Fatal("JWT_SECRET must be at least 32 characters long")
	}

	return &Config{
		DatabaseURL: getEnv("DATABASE_URL", "postgres://stockmanager:changeme@db:5432/stockmanager?sslmode=disable"),
		JWTSecret:   jwtSecret,
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
