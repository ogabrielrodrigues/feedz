package handler

import (
	"encoding/json"
	"net/http"

	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/dto"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/httperr"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/response"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/domain/entity"
)

type AnswerHandler struct {
	repository entity.AnswerRepository
}

func NewAnswerHandler(repository entity.AnswerRepository) *AnswerHandler {
	return &AnswerHandler{repository}
}

func (ah *AnswerHandler) ReplyFeedback(w http.ResponseWriter, r *http.Request) {
	body := dto.ReplyFeedbackDto{}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		httpErr := httperr.NewInternalServerError("erro ao decodificar corpo do JSON")
		response.Json(w, httpErr.HttpCode, httpErr)
		return
	}

	err := ah.repository.ReplyFeedback(r.Context(), &body)
	if err != nil {
		response.Json(w, err.HttpCode, err)
		return
	}

	response.End(w, http.StatusOK)
}

func (ah *AnswerHandler) ListAnswers(w http.ResponseWriter, r *http.Request) {
	answers, err := ah.repository.ListAnswers()
	if err != nil {
		response.Json(w, err.HttpCode, err)
		return
	}

	response.Json(w, http.StatusOK, answers)
}

func (ah *AnswerHandler) FindAnswerByID(w http.ResponseWriter, r *http.Request) {
	answerID := r.PathValue("answerID")

	answer, err := ah.repository.FindAnswerByID(answerID)
	if err != nil {
		response.Json(w, err.HttpCode, err)
		return
	}

	response.Json(w, http.StatusOK, answer)
}
