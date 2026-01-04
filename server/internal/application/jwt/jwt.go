package jwt

import (
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/config"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/httperr"
)

func ExtractToken(authorization string) (string, *httperr.HttpError) {
	authorization = strings.TrimSpace(authorization)

	if !strings.HasPrefix(authorization, "Bearer ") {
		return "", httperr.NewUnauthorizedError("token em formato inválido")
	}

	token := strings.TrimPrefix(authorization, "Bearer ")

	return token, nil
}

func GenerateToken(employeeRegistry string, jwtSecret string) (string, *httperr.HttpError) {
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": employeeRegistry,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	token, err := claims.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", httperr.NewInternalServerError("erro ao gerar token")
	}

	return token, nil
}

func ParseToken(token string) (string, *httperr.HttpError) {
	config := config.GetConfig()

	parsed, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.JwtSecret), nil
	})

	if err != nil {
		return "", httperr.NewUnauthorizedError("erro ao processar token")
	}

	employeeRegistry, err := parsed.Claims.GetSubject()
	if err != nil {
		return "", httperr.NewUnauthorizedError("erro ao recuperar conteúdo do token")
	}

	return employeeRegistry, nil
}
