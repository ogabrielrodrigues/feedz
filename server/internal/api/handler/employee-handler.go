package handler

import (
	"encoding/json"
	"net/http"

	"github.com/ogabrielrodrigues/hackaton-minerva/server/config"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/dto"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/httperr"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/jwt"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/response"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/domain/entity"
)

type EmployeeHandler struct {
	repository entity.EmployeeRepository
}

func NewEmployeeHandler(repository entity.EmployeeRepository) *EmployeeHandler {
	return &EmployeeHandler{repository}
}

func (eh *EmployeeHandler) FindEmployeeByRegistry(w http.ResponseWriter, r *http.Request) {
	registry := r.PathValue("registry")
	if registry == "" {
		err := httperr.NewBadRequestError("o parâmetro registry não pode ser inválido")
		response.Json(w, err.HttpCode, err)
		return
	}

	employee, err := eh.repository.FindEmployeeByRegistry(registry)
	if err != nil {
		response.Json(w, err.HttpCode, err)
		return
	}

	response.Json(w, http.StatusOK, employee)
}

func (eh *EmployeeHandler) FindEmployeeByAuth(w http.ResponseWriter, r *http.Request) {
	employee, err := eh.repository.FindEmployeeByAuth(r.Context())
	if err != nil {
		response.Json(w, err.HttpCode, err)
		return
	}

	response.Json(w, http.StatusOK, employee)
}

func (eh *EmployeeHandler) ListEmployees(w http.ResponseWriter, r *http.Request) {
	employees, err := eh.repository.ListEmployees()
	if err != nil {
		response.Json(w, err.HttpCode, err)
		return
	}

	response.Json(w, http.StatusOK, employees)
}

func (eh *EmployeeHandler) CreateEmployee(w http.ResponseWriter, r *http.Request) {
	body := dto.CreateEmployeeDto{}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		httpErr := httperr.NewInternalServerError("erro ao decodificar corpo do JSON")
		response.Json(w, httpErr.HttpCode, httpErr)
		return
	}

	err := eh.repository.CreateEmployee(&body)
	if err != nil {
		response.Json(w, err.HttpCode, err)
		return
	}

	response.End(w, http.StatusCreated)
}

func (eh *EmployeeHandler) AuthenticateEmployee(w http.ResponseWriter, r *http.Request) {
	config := config.GetConfig()
	body := dto.AuthenticateEmployeeDto{}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		httpErr := httperr.NewInternalServerError("erro ao decodificar corpo do JSON")
		response.Json(w, httpErr.HttpCode, httpErr)
		return
	}

	employee, err := eh.repository.AuthenticateEmployee(&body)
	if err != nil {
		response.Json(w, err.HttpCode, err)
		return
	}

	authToken, err := jwt.GenerateToken(employee.Registry, config.JwtSecret)
	if err != nil {
		response.Json(w, err.HttpCode, err)
		return
	}

	w.Header().Set("Authorization", authToken)
	w.WriteHeader(http.StatusOK)
}
