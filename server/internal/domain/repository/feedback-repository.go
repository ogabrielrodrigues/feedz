package repository

import (
	"context"
	"net/url"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/dto"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/httperr"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/domain/entity"
)

type feedbackRepository struct {
	database *pgxpool.Pool
}

func NewFeedbackRepository(database *pgxpool.Pool) entity.FeedbackRepository {
	return &feedbackRepository{database}
}

func (fr *feedbackRepository) ListFeedbacks() (*[]dto.FeedbackDto, *httperr.HttpError) {
	ctx := context.Background()

	rows, err := fr.database.Query(ctx, `select * from feedback`)
	if err != nil {
		return nil, httperr.NewInternalServerError(err.Error())
	}

	feedbacks := []dto.FeedbackDto{}
	feedback := dto.FeedbackDto{}

	for rows.Next() {
		defer rows.Close()

		if err := rows.Scan(
			&feedback.FeedbackID,
			&feedback.EmployeeRegistry,
			&feedback.Content,
			&feedback.Answered,
			&feedback.AnswerID,
			&feedback.SentAt,
		); err != nil {
			return nil, httperr.NewInternalServerError(err.Error())
		}

		feedbacks = append(feedbacks, feedback)
	}

	return &feedbacks, nil
}

func (fr *feedbackRepository) FilterFeedbacks(filters url.Values) (*[]dto.FeedbackDto, *httperr.HttpError) {
	ctx := context.Background()

	query := `select f.* from feedback f
	join employee e
	on f.employee_registry = e.registry`

	var rows pgx.Rows
	var err error

	if filters.Has("unit") && filters.Has("sector") {
		query += ` where e.unit = $1 and e.sector = $2`
		rows, err = fr.database.Query(ctx, query, filters.Get("unit"), filters.Get("sector"))
	} else if filters.Has("unit") {
		query += ` where e.unit = $1`
		rows, err = fr.database.Query(ctx, query, filters.Get("unit"))
	} else {
		query += ` where e.sector = $1`
		rows, err = fr.database.Query(ctx, query, filters.Get("sector"))
	}

	if err != nil {
		return nil, httperr.NewInternalServerError(err.Error())
	}

	feedbacks := []dto.FeedbackDto{}
	feedback := dto.FeedbackDto{}

	for rows.Next() {
		defer rows.Close()

		if err := rows.Scan(
			&feedback.FeedbackID,
			&feedback.EmployeeRegistry,
			&feedback.Content,
			&feedback.Answered,
			&feedback.AnswerID,
			&feedback.SentAt,
		); err != nil {
			return nil, httperr.NewInternalServerError(err.Error())
		}

		feedbacks = append(feedbacks, feedback)
	}

	return &feedbacks, nil
}

func (fr *feedbackRepository) CreateFeedback(dto *dto.CreateFeedbackDto) *httperr.HttpError {
	ctx := context.Background()

	if _, err := fr.database.Exec(ctx,
		`insert into feedback (employee_registry, content)
		values ($1, $2)`,
		dto.EmployeeRegistry,
		dto.Content,
	); err != nil {
		return httperr.NewInternalServerError(err.Error())
	}

	return nil
}
