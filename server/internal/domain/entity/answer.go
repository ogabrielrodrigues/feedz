package entity

import (
	"context"
	"time"

	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/dto"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/httperr"
)

type AnswerRepository interface {
	ReplyFeedback(ctx context.Context, dto *dto.ReplyFeedbackDto) *httperr.HttpError
	ListAnswers() (*[]dto.AnswerDto, *httperr.HttpError)
	FindAnswerByID(answerID string) (*dto.AnswerDto, *httperr.HttpError)
}

type Answer struct {
	AnswerID   string
	AnsweredBy string
	Content    string
	AnsweredAt time.Time
	Active     bool
}

func NewAnswer(answeredBy, content string) *Answer {
	return &Answer{
		AnsweredBy: answeredBy,
		Content:    content,
	}
}
