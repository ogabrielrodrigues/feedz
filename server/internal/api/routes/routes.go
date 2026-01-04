package routes

import (
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/api/factory"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/api/middleware"
)

func makeHandler(handler func(w http.ResponseWriter, r *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		handler(w, r)
	}
}

func RegisterRoutes(mux *http.ServeMux, pool *pgxpool.Pool) {
	registerEmployeeRoutes(mux, pool)
	registerFeedbackRoutes(mux, pool)
	registerAnswerRoutes(mux, pool)
}

func registerEmployeeRoutes(mux *http.ServeMux, pool *pgxpool.Pool) {
	handler := factory.NewEmployeeFactory(pool)

	mux.Handle("GET /api/employee/{registry}", middleware.AuthMiddleware(makeHandler(handler.FindEmployeeByRegistry)))
	mux.Handle("GET /api/employee", middleware.AuthMiddleware(makeHandler(handler.FindEmployeeByAuth)))
	mux.HandleFunc("POST /api/employee", makeHandler(handler.CreateEmployee))
	mux.HandleFunc("POST /api/authenticate", makeHandler(handler.AuthenticateEmployee))
}

func registerFeedbackRoutes(mux *http.ServeMux, pool *pgxpool.Pool) {
	handler := factory.NewFeedbackFactory(pool)

	mux.Handle("GET /api/feedback", middleware.AuthMiddleware(makeHandler(handler.ListFeedbacks)))
	mux.Handle("GET /api/feedback/filter", middleware.AuthMiddleware(makeHandler(handler.FilterFeedbacks)))
	mux.Handle("POST /api/feedback", middleware.AuthMiddleware(makeHandler(handler.Create)))
	mux.Handle("DELETE /api/feedback/{feedbackID}", middleware.AuthMiddleware(makeHandler(handler.Delete)))
}

func registerAnswerRoutes(mux *http.ServeMux, pool *pgxpool.Pool) {
	handler := factory.NewAnswerFactory(pool)

	mux.Handle("POST /api/feedback/reply", middleware.AuthMiddleware(makeHandler(handler.ReplyFeedback)))
	mux.Handle("GET /api/answer", middleware.AuthMiddleware(makeHandler(handler.ListAnswers)))
	mux.Handle("GET /api/answer/{answerID}", middleware.AuthMiddleware(makeHandler(handler.FindAnswerByID)))
}
