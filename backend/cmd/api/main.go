package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"

	"github.com/DevDiegolas/Stock-Manager/backend/internal/domain/catalog"
	"github.com/DevDiegolas/Stock-Manager/backend/internal/domain/history"
	"github.com/DevDiegolas/Stock-Manager/backend/internal/domain/product"
	"github.com/DevDiegolas/Stock-Manager/backend/internal/domain/user"
	"github.com/DevDiegolas/Stock-Manager/backend/internal/platform/auth"
	"github.com/DevDiegolas/Stock-Manager/backend/internal/platform/config"
	"github.com/DevDiegolas/Stock-Manager/backend/internal/platform/database"
	"github.com/DevDiegolas/Stock-Manager/backend/internal/platform/middleware"
)

func main() {
	cfg := config.Load()

	// Run migrations
	m, err := migrate.New("file:///migrations", cfg.DatabaseURL)
	if err != nil {
		log.Printf("Warning: could not create migrator: %v", err)
	} else {
		if err := m.Up(); err != nil && err != migrate.ErrNoChange {
			log.Fatalf("Migration failed: %v", err)
		}
		log.Println("Migrations applied successfully")
	}

	// Connect to database
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Initialize services
	jwtService := auth.NewJWTService(cfg.JWTSecret)

	userRepo := user.NewRepository(db)
	userService := user.NewService(userRepo, jwtService)
	userHandler := user.NewHandler(userService)

	historyRepo := history.NewRepository(db)
	historyService := history.NewService(historyRepo)
	historyHandler := history.NewHandler(historyService)

	productRepo := product.NewRepository(db)
	productService := product.NewService(productRepo, historyRepo)
	productHandler := product.NewHandler(productService)

	catalogRepo := catalog.NewRepository(db)
	catalogService := catalog.NewService(catalogRepo, productRepo)
	catalogHandler := catalog.NewHandler(catalogService)

	// Setup router
	r := chi.NewRouter()

	r.Use(cors.Handler(middleware.CORS()))
	r.Use(middleware.Logger)

	// Health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok"}`))
	})

	// API routes
	r.Route("/api/v1", func(r chi.Router) {
		// Auth (public)
		r.Route("/auth", func(r chi.Router) {
			r.Post("/register", userHandler.Register)
			r.Post("/login", userHandler.Login)

			// Protected
			r.Group(func(r chi.Router) {
				r.Use(middleware.Auth(jwtService))
				r.Get("/me", userHandler.Me)
			})
		})

		// Public catalog (no auth)
		r.Get("/public/catalog/{slug}", catalogHandler.GetPublicCatalog)

		// Protected routes
		r.Group(func(r chi.Router) {
			r.Use(middleware.Auth(jwtService))

			// Products
			r.Route("/products", func(r chi.Router) {
				r.Get("/", productHandler.List)
				r.Post("/", productHandler.Create)
				r.Get("/{id}", productHandler.GetByID)
				r.Put("/{id}", productHandler.Update)
				r.Delete("/{id}", productHandler.Delete)
				r.Patch("/{id}/toggle-active", productHandler.ToggleActive)
				r.Post("/{id}/quantity", productHandler.AdjustQuantity)
				r.Post("/{id}/photos", productHandler.AddPhoto)
				r.Delete("/{id}/photos/{photoId}", productHandler.DeletePhoto)
			})

			// Catalog settings
			r.Route("/catalog", func(r chi.Router) {
				r.Get("/settings", catalogHandler.GetSettings)
				r.Put("/settings", catalogHandler.SaveSettings)
			})

			// History
			r.Route("/history", func(r chi.Router) {
				r.Get("/", historyHandler.List)
				r.Delete("/", historyHandler.Clear)
				r.Get("/product/{productId}", historyHandler.ListByProduct)
			})
		})
	})

	log.Printf("Server starting on port %s", cfg.ServerPort)
	if err := http.ListenAndServe(":"+cfg.ServerPort, r); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
