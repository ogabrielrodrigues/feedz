package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ogabrielrodrigues/hackaton-minerva/server/config"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/api/middleware"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/api/router"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/database"
	"github.com/phuslu/log"
)

func main() {
	if err := config.Load(); err != nil {
		log.Error().Err(err)
	}

	config := config.GetConfig()

	dbPool, err := database.NewDatabasePool(config.DbConnectionString)
	if err != nil {
		log.Error().Msgf("erro ao estabelecer conexão com o banco de dados. err=%v", err)
	}

	handler := router.NewRouter(dbPool)

	handler = middleware.CorsMiddleware(
		handler,
		config.JwtSecret,
	)

	server := &http.Server{
		Addr:           config.Addr,
		Handler:        handler,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	go func() {
		log.Info().Msgf("servidor iniciado em: %s", config.Addr)
		if err := server.ListenAndServe(); err != http.ErrServerClosed {
			log.Panic().Msgf("erro ao iniciar servidor. err=%v", err)
		}
	}()

	ch := make(chan os.Signal, 1)
	signal.Notify(ch, syscall.SIGINT, syscall.SIGTERM)
	<-ch

	log.Info().Msg("iniciando encerramento do servidor...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Panic().Msgf("erro ao encerrar o servidor. err=%v", err)
	}

	log.Info().Msg("servidor encerrado")
}
