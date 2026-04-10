package catalog

import (
	"encoding/json"
	"net/http"

	"github.com/DevDiegolas/Stock-Manager/backend/internal/platform/middleware"
	"github.com/go-chi/chi/v5"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) GetSettings(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())

	settings, err := h.service.GetSettings(userID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to get settings"})
		return
	}

	writeJSON(w, http.StatusOK, settings)
}

func (h *Handler) SaveSettings(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())

	var req UpdateSettingsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid request body"})
		return
	}

	settings, err := h.service.SaveSettings(userID, req)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to save settings"})
		return
	}

	writeJSON(w, http.StatusOK, settings)
}

func (h *Handler) GetPublicCatalog(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")

	catalog, err := h.service.GetPublicCatalog(slug)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "catalog not found"})
		return
	}

	writeJSON(w, http.StatusOK, catalog)
}

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}
