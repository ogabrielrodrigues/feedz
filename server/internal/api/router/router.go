package router

import (
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/api/routes"
)

type Handler struct {
	pool   *pgxpool.Pool
	router *http.ServeMux
}

func (h Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	h.router.ServeHTTP(w, r)
}

func NewRouter(pool *pgxpool.Pool) http.Handler {
	handler := Handler{pool: pool}

	mux := http.NewServeMux()
	routes.RegisterRoutes(mux, pool)

	handler.router = mux
	return handler
}
