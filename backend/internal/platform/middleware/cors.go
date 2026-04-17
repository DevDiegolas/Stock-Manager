package middleware

import (
	"os"
	"strings"

	"github.com/go-chi/cors"
)

func CORS() cors.Options {
	origins := []string{"http://localhost:3000", "http://localhost:5173"}
	if env := strings.TrimSpace(os.Getenv("ALLOWED_ORIGINS")); env != "" {
		parts := strings.Split(env, ",")
		origins = origins[:0]
		for _, p := range parts {
			if v := strings.TrimSpace(p); v != "" {
				origins = append(origins, v)
			}
		}
	}

	return cors.Options{
		AllowedOrigins:   origins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}
}
