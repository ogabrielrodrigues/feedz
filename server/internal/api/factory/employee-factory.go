package factory

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/api/handler"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/domain/repository"
)

func NewEmployeeFactory(pool *pgxpool.Pool) *handler.EmployeeHandler {
	repository := repository.NewEmployeeRepository(pool)
	handler := handler.NewEmployeeHandler(repository)

	return handler
}
