package response

import (
	"encoding/json"
	"net/http"

	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/httperr"
)

type response struct {
	Status string `json:"status"`
	Code   int    `json:"code"`
	Result any    `json:"result"`
}

func Json(w http.ResponseWriter, code int, data any) *httperr.HttpError {
	w.Header().Add("content-type", "application/json")

	w.WriteHeader(code)
	if err := json.NewEncoder(w).Encode(response{
		Status: http.StatusText(code),
		Code:   code,
		Result: data,
	}); err != nil {
		return httperr.NewInternalServerError("erro ao codificar a resposta JSON")
	}

	return nil
}

func End(w http.ResponseWriter, code int) *httperr.HttpError {
	w.WriteHeader(code)

	return nil
}
