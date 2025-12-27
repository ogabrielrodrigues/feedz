package httperr

import (
	"net/http"
	"time"
)

const (
	ValidationError          string = "VALIDATION_ERROR"
	BadRequestError          string = "BAD_REQUEST_ERROR"
	UnauthorizedError        string = "UNAUTHORIZED_ERROR"
	ForbiddenError           string = "FORBIDDEN_ERROR"
	NotFoundError            string = "NOT_FOUND_ERROR"
	AlreadyExistsError       string = "ALREADY_EXISTS_ERROR"
	UnprocessableEntityError string = "UNPROCESSABLE_ENTITY_ERROR"
	InternalServerError      string = "INTERNAL_SERVER_ERROR"
)

type HttpError struct {
	Code      string                 `json:"code"`
	HttpCode  int                    `json:"-"`
	Message   string                 `json:"message"`
	Context   map[string]interface{} `json:"context,omitempty"`
	Timestamp time.Time              `json:"timestamp"`
	Cause     error                  `json:"cause,omitempty"`
}

func (err HttpError) Error() string {
	return err.Message
}

func (err HttpError) Unwrap() error {
	return err.Cause
}

func (e *HttpError) Is(target error) bool {
	if targetErr, ok := target.(*HttpError); ok {
		return e.Code == targetErr.Code
	}

	return false
}

func NewInternalServerError(reason string) *HttpError {
	return &HttpError{
		Code:     InternalServerError,
		HttpCode: http.StatusInternalServerError,
		Message:  "Internal server error",
		Context: map[string]interface{}{
			"reason": reason,
		},
	}
}

func NewBadRequestError(reason string) *HttpError {
	return &HttpError{
		Code:     BadRequestError,
		HttpCode: http.StatusBadRequest,
		Message:  "Bad request",
		Context: map[string]interface{}{
			"reason": reason,
		},
	}
}

func NewUnauthorizedError(reason string) *HttpError {
	return &HttpError{
		Code:     UnauthorizedError,
		HttpCode: http.StatusUnauthorized,
		Message:  "Unauthorized",
		Context: map[string]interface{}{
			"reason": reason,
		},
	}
}

func NewForbiddenError(reason string) *HttpError {
	return &HttpError{
		Code:     ForbiddenError,
		HttpCode: http.StatusForbidden,
		Message:  "Forbidden",
		Context: map[string]interface{}{
			"reason": reason,
		},
	}
}

func NewNotFoundError(reason string) *HttpError {
	return &HttpError{
		Code:     NotFoundError,
		HttpCode: http.StatusNotFound,
		Message:  "Not found",
		Context: map[string]interface{}{
			"reason": reason,
		},
	}
}

func NewAlreadyExistsError(reason string) *HttpError {
	return &HttpError{
		Code:     AlreadyExistsError,
		HttpCode: http.StatusConflict,
		Message:  "Conflict",
		Context: map[string]interface{}{
			"reason": reason,
		},
	}
}

func NewUnprocessableEntityError(reason string) *HttpError {
	return &HttpError{
		Code:     UnprocessableEntityError,
		HttpCode: http.StatusUnprocessableEntity,
		Message:  "Unprocessable Entity",
		Context: map[string]interface{}{
			"reason": reason,
		},
	}
}
