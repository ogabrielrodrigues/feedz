package middleware

import (
	"context"
	"net/http"

	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/jwt"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/response"
)

type contextKey string

func (c contextKey) String() string {
	return string(c)
}

var (
	EmployeeRegistryKey = contextKey("employeeID")
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authorization := r.Header.Get("Authorization")

		token, err := jwt.ExtractToken(authorization)
		if err != nil {
			response.Json(w, err.HttpCode, err)
			return
		}

		employeeRegistry, err := jwt.ParseToken(token)
		if err != nil {
			response.Json(w, err.HttpCode, err)
			return
		}

		ctx := context.WithValue(r.Context(), EmployeeRegistryKey, employeeRegistry)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
