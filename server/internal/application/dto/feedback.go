package dto

import "time"

type CreateFeedbackDto struct {
	EmployeeRegistry string `json:"employeeRegistry"`
	Content          string `json:"content"`
}

type ReplyFeedbackDto struct {
	FeedbackID string `json:"feedbackID"`
	Content    string `json:"content"`
}

type FeedbackDto struct {
	FeedbackID       string    `json:"feedbackID"`
	EmployeeRegistry string    `json:"employeeRegistry"`
	Content          string    `json:"content"`
	Answered         bool      `json:"answered"`
	AnswerID         *string   `json:"answerID,omitempty"`
	SentAt           time.Time `json:"sentAt"`
	Active           bool      `json:"active"`
}
