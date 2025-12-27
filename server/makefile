include .env

.PHONY: default run clean build migrate-up migrate-down

APP_NAME=hackaton-minerva

default: run

run:
	@go run cmd/main.go

clean:
	@rm -f bin/${APP_NAME}

build: clean
	@go build -C cmd -o ../${APP_NAME}

migrate-up:
	@DATABASE_HOST="${DATABASE_HOST}" \
	DATABASE_PORT="${DATABASE_PORT}" \
	DATABASE_NAME="${DATABASE_NAME}" \
	DATABASE_USER="${DATABASE_USER}" \
	DATABASE_PWD="${DATABASE_PWD}" \
	tern migrate --migrations internal/database/migrations \
	--config internal/database/migrations/tern.conf

migrate-down:
	DATABASE_HOST="${DATABASE_HOST}" \
	DATABASE_PORT="${DATABASE_PORT}" \
	DATABASE_NAME="${DATABASE_NAME}" \
	DATABASE_USER="${DATABASE_USER}" \
	DATABASE_PWD="${DATABASE_PWD}" \
	tern migrate --migrations internal/database/migrations \
	--config internal/database/migrations/tern.conf -d -1
