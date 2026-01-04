package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Addr               string
	Origin             string
	DbConnectionString string
	JwtSecret          string
}

var globalConfig Config

func Load() error {
	if err := godotenv.Load(); err != nil {
		return fmt.Errorf("erro ao ler as variaveis de ambiente")
	}

	addr := os.Getenv("ADDR")
	if addr == "" {
		return fmt.Errorf("variável de ambiente ADDR não definida")
	}

	origin := os.Getenv("ORIGIN")
	if origin == "" {
		return fmt.Errorf("variável de ambiente ORIGIN não definida")
	}

	dbConnectionString := os.Getenv("DB_CONNECTION_STRING")
	if dbConnectionString == "" {
		return fmt.Errorf("variável de ambiente DB_CONNECTION_STRING não definida")
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return fmt.Errorf("variável de ambiente JWT_SECRET não definida")
	}

	globalConfig.Addr = addr
	globalConfig.Origin = origin
	globalConfig.DbConnectionString = dbConnectionString
	globalConfig.JwtSecret = jwtSecret

	return nil
}

func GetConfig() *Config {
	return &globalConfig
}
