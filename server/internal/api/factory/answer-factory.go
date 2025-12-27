package factory

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/api/handler"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/domain/repository"
)

func NewAnswerFactory(pool *pgxpool.Pool) *handler.AnswerHandler {
	repository := repository.NewAnswerRepository(pool)
	handler := handler.NewAnswerHandler(repository)

	return handler
}
