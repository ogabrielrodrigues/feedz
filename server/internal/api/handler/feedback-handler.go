package handler

import (
	"encoding/json"
	"net/http"

	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/dto"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/httperr"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/response"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/domain/entity"
)

type FeedbackHandler struct {
	repository entity.FeedbackRepository
}

func NewFeedbackHandler(repository entity.FeedbackRepository) *FeedbackHandler {
	return &FeedbackHandler{repository}
}

func (fh *FeedbackHandler) ListFeedbacks(w http.ResponseWriter, r *http.Request) {
	feedbacks, err := fh.repository.ListFeedbacks()
	if err != nil {
		response.Json(w, err.HttpCode, err)
		return
	}

	response.Json(w, http.StatusOK, feedbacks)
}

func (fh *FeedbackHandler) FilterFeedbacks(w http.ResponseWriter, r *http.Request) {
	filters := r.URL.Query()

	if !filters.Has("unit") && !filters.Has("sector") {
		httpErr := httperr.NewBadRequestError("unit ou sector não informados")
		response.Json(w, httpErr.HttpCode, httpErr)
		return
	}

	feedbacks, err := fh.repository.FilterFeedbacks(filters)
	if err != nil {
		response.Json(w, err.HttpCode, err)
		return
	}

	response.Json(w, http.StatusOK, feedbacks)
}

func (fh *FeedbackHandler) Create(w http.ResponseWriter, r *http.Request) {
	body := dto.CreateFeedbackDto{}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		httpErr := httperr.NewInternalServerError("erro ao decodificar corpo do JSON")
		response.Json(w, httpErr.HttpCode, httpErr)
		return
	}

	err := fh.repository.CreateFeedback(&body)
	if err != nil {
		response.Json(w, err.HttpCode, err)
		return
	}

	response.End(w, http.StatusCreated)
}

func (fh *FeedbackHandler) Delete(w http.ResponseWriter, r *http.Request) {
	feedbackID := r.PathValue("feedbackID")
	if feedbackID == "" {
		err := httperr.NewBadRequestError("o parâmetro feedbackID não pode ser inválido")
		response.Json(w, err.HttpCode, err)
		return
	}

	err := fh.repository.DeleteFeedback(feedbackID)
	if err != nil {
		response.Json(w, err.HttpCode, err)
		return
	}

	response.End(w, http.StatusOK)
}
