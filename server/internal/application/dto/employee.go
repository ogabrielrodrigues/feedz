package dto

type CreateEmployeeDto struct {
	Registry      string `json:"registry"`
	Fullname      string `json:"fullname"`
	Email         string `json:"email"`
	Sector        string `json:"sector"`
	Unit          string `json:"unit"`
	Administrator bool   `json:"administrator"`
	Password      string `json:"password"`
}

type AuthenticateEmployeeDto struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type EmployeeDto struct {
	Registry      string        `json:"registry"`
	Fullname      string        `json:"fullname"`
	Email         string        `json:"email"`
	Sector        string        `json:"sector"`
	Unit          string        `json:"unit"`
	Administrator bool          `json:"administrator"`
	Feedbacks     []FeedbackDto `json:"feedbacks,omitempty"`
}
