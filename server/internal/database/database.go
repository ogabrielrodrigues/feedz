package database

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

func NewDatabasePool(connString string) (*pgxpool.Pool, error) {
	ctx := context.Background()

	pool, err := pgxpool.New(ctx, connString)
	if err != nil {
		return nil, err
	}

	pool.Config().HealthCheckPeriod = time.Minute
	pool.Config().MaxConnLifetime = 30 * time.Minute
	pool.Config().MaxConnIdleTime = 10 * time.Minute

	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, err
	}

	return pool, nil
}

func IsUniqueConstraint(err error) bool {
	var pg_err *pgconn.PgError
	if !errors.As(err, &pg_err) {
		return false
	}

	if pg_err.Code == "23505" {
		return true
	}

	return false
}

func IsErrNoRows(err error) bool {
	return errors.Is(err, pgx.ErrNoRows)
}
