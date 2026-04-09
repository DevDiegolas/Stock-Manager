package history

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/DevDiegolas/Stock-Manager/backend/internal/platform/middleware"
	"github.com/go-chi/chi/v5"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())

	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	params := ListParams{
		Page:  page,
		Limit: limit,
	}

	resp, err := h.service.List(userID, params)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to list history"})
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

func (h *Handler) Clear(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())

	if err := h.service.Clear(userID); err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to clear history"})
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"message": "history cleared"})
}

func (h *Handler) ListByProduct(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())
	productID := chi.URLParam(r, "productId")

	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	params := ListParams{
		Page:      page,
		Limit:     limit,
		ProductID: productID,
	}

	resp, err := h.service.List(userID, params)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to list history"})
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}
