package dto

import "time"

type AnswerDto struct {
	AnswerID   string    `json:"answerID"`
	AnsweredBy string    `json:"answeredBy"`
	Content    string    `json:"content"`
	AnsweredAt time.Time `json:"answeredAt"`
	Active     bool      `json:"active"`
}
