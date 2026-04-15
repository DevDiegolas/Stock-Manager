package product

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"strings"

	"github.com/DevDiegolas/Stock-Manager/backend/internal/platform/middleware"
	"github.com/go-chi/chi/v5"
)

type Handler struct {
	service *Service
	storage photoUploader
}

type photoUploader interface {
	SaveProductPhoto(reader io.Reader, originalName string) (string, error)
}

func NewHandler(service *Service, storage photoUploader) *Handler {
	return &Handler{service: service, storage: storage}
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())

	var req CreateProductRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid request body"})
		return
	}

	product, err := h.service.Create(userID, req)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	writeJSON(w, http.StatusCreated, product)
}

func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())
	productID := chi.URLParam(r, "id")

	product, err := h.service.GetByID(productID, userID)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "product not found"})
		return
	}

	writeJSON(w, http.StatusOK, product)
}

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())

	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	params := ListParams{
		Page:     page,
		Limit:    limit,
		Category: r.URL.Query().Get("category"),
		Search:   r.URL.Query().Get("search"),
	}

	if activeStr := r.URL.Query().Get("active"); activeStr != "" {
		active := activeStr == "true"
		params.Active = &active
	}

	resp, err := h.service.List(userID, params)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to list products"})
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())
	productID := chi.URLParam(r, "id")

	var req UpdateProductRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid request body"})
		return
	}

	product, err := h.service.Update(productID, userID, req)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	writeJSON(w, http.StatusOK, product)
}

func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())
	productID := chi.URLParam(r, "id")

	if err := h.service.Delete(productID, userID); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"message": "product deleted"})
}

func (h *Handler) AdjustQuantity(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())
	productID := chi.URLParam(r, "id")

	var req AdjustQuantityRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid request body"})
		return
	}

	product, err := h.service.AdjustQuantity(productID, userID, req)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	writeJSON(w, http.StatusOK, product)
}

func (h *Handler) ToggleActive(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())
	productID := chi.URLParam(r, "id")

	product, err := h.service.ToggleActive(productID, userID)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	writeJSON(w, http.StatusOK, product)
}

func (h *Handler) AddPhoto(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())
	productID := chi.URLParam(r, "id")

	var req AddPhotoRequest

	if strings.HasPrefix(r.Header.Get("Content-Type"), "multipart/form-data") {
		const maxPhotoSizeBytes = 20 << 20

		if h.storage == nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "photo storage is not configured"})
			return
		}

		if err := r.ParseMultipartForm(maxPhotoSizeBytes); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid multipart body"})
			return
		}

		position, _ := strconv.Atoi(r.FormValue("position"))
		if position == 0 {
			position = 1
		}

		file, fileHeader, err := r.FormFile("file")
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "file is required"})
			return
		}
		defer file.Close()

		if fileHeader.Size > maxPhotoSizeBytes {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "image must be up to 20MB"})
			return
		}

		contentType := fileHeader.Header.Get("Content-Type")
		if contentType != "" && !strings.HasPrefix(contentType, "image/") {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "only image files are allowed"})
			return
		}

		publicPath, err := h.storage.SaveProductPhoto(file, fileHeader.Filename)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to save photo"})
			return
		}

		req = AddPhotoRequest{
			DriveFileID: publicPath,
			Position:    position,
		}
	} else {
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid request body"})
			return
		}
	}

	photo, err := h.service.AddPhoto(productID, userID, req)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	writeJSON(w, http.StatusCreated, photo)
}

func (h *Handler) DeletePhoto(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())
	productID := chi.URLParam(r, "id")
	photoID := chi.URLParam(r, "photoId")

	if err := h.service.DeletePhoto(photoID, productID, userID); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"message": "photo deleted"})
}

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}
