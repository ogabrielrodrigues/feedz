package factory

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/api/handler"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/domain/repository"
)

func NewFeedbackFactory(pool *pgxpool.Pool) *handler.FeedbackHandler {
	repository := repository.NewFeedbackRepository(pool)
	handler := handler.NewFeedbackHandler(repository)

	return handler
}
