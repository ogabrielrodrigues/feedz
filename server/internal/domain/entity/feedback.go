package entity

import (
	"net/url"
	"time"

	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/dto"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/httperr"
)

type FeedbackRepository interface {
	ListFeedbacks() (*[]dto.FeedbackDto, *httperr.HttpError)
	FilterFeedbacks(filters url.Values) (*[]dto.FeedbackDto, *httperr.HttpError)
	CreateFeedback(dto *dto.CreateFeedbackDto) *httperr.HttpError
}

type Feedback struct {
	FeedbackID       string
	EmployeeRegistry string
	Content          string
	Answered         bool
	AnswerID         string
	SentAt           time.Time
}

func NewFeedback(employeeRegistry, content string) *Feedback {
	return &Feedback{
		EmployeeRegistry: employeeRegistry,
		Content:          content,
	}
}
