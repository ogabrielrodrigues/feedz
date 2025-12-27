package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	Origin      string
	DatabaseUrl string
	JwtSecret   string
}

var globalConfig Config

func Load() error {
	if err := godotenv.Load(); err != nil {
		return fmt.Errorf("erro ao ler as variaveis de ambiente")
	}

	port := os.Getenv("PORT")
	if port == "" {
		return fmt.Errorf("variável de ambiente PORT não definida")
	}

	origin := os.Getenv("ORIGIN")
	if origin == "" {
		return fmt.Errorf("variável de ambiente ORIGIN não definida")
	}

	databaseUrl := os.Getenv("DATABASE_URL")
	if databaseUrl == "" {
		return fmt.Errorf("variável de ambiente DATABASE_URL não definida")
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return fmt.Errorf("variável de ambiente JWT_SECRET não definida")
	}

	globalConfig.Port = port
	globalConfig.Origin = origin
	globalConfig.DatabaseUrl = databaseUrl
	globalConfig.JwtSecret = jwtSecret

	return nil
}

func GetConfig() *Config {
	return &globalConfig
}
