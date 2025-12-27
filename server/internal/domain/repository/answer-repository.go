package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/api/middleware"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/dto"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/httperr"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/domain/entity"
)

type AnswerRepository struct {
	database *pgxpool.Pool
}

func NewAnswerRepository(database *pgxpool.Pool) entity.AnswerRepository {
	return &AnswerRepository{database}
}

func (ar *AnswerRepository) ReplyFeedback(ctx context.Context, replyDto *dto.ReplyFeedbackDto) *httperr.HttpError {
	employeeRegistry, ok := ctx.Value(middleware.EmployeeRegistryKey).(string)
	if !ok {
		return httperr.NewUnauthorizedError("não autorizado")
	}

	tx, err := ar.database.Begin(ctx)
	if err != nil {
		tx.Rollback(ctx)
		return httperr.NewInternalServerError(err.Error())
	}

	row := tx.QueryRow(ctx,
		`insert into answer (answered_by, content, )
		values ($1, $2) returning answer_id`,
		employeeRegistry, replyDto.Content)

	var answerID string

	if err := row.Scan(&answerID); err != nil {
		tx.Rollback(ctx)
		return httperr.NewInternalServerError(err.Error())
	}

	_, err = tx.Exec(ctx,
		`update feedback set answered = true,
		answer_id = $1
		where feedback_id = $2`, answerID, replyDto.FeedbackID)

	if err != nil {
		tx.Rollback(ctx)
		return httperr.NewInternalServerError(err.Error())
	}

	if err := tx.Commit(ctx); err != nil {
		tx.Rollback(ctx)
		return httperr.NewInternalServerError(err.Error())
	}

	return nil
}

func (ar *AnswerRepository) ListAnswers() (*[]dto.AnswerDto, *httperr.HttpError) {
	ctx := context.Background()

	rows, err := ar.database.Query(ctx,
		`select a.* from feedback f
		join answer a on f.answer_id = a.id`,
	)

	if err != nil {
		return nil, httperr.NewInternalServerError(err.Error())
	}

	answers := []dto.AnswerDto{}
	answer := dto.AnswerDto{}

	for rows.Next() {
		defer rows.Close()

		if err := rows.Scan(
			&answer.AnswerID,
			&answer.AnsweredBy,
			&answer.Content,
			&answer.AnsweredAt,
		); err != nil {
			return nil, httperr.NewInternalServerError(err.Error())
		}

		answers = append(answers, answer)
	}

	return &answers, nil
}

func (ar *AnswerRepository) FindAnswerByID(answerID string) (*dto.AnswerDto, *httperr.HttpError) {
	ctx := context.Background()

	row := ar.database.QueryRow(ctx,
		`select a.* from feedback f
		join answer a on f.answer_id = a.id
		where a.id = $1`, answerID,
	)

	answer := dto.AnswerDto{}

	if err := row.Scan(
		&answer.AnswerID,
		&answer.AnsweredBy,
		&answer.Content,
		&answer.AnsweredAt,
	); err != nil {
		return nil, httperr.NewInternalServerError(err.Error())
	}

	return &answer, nil
}
