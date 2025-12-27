package entity

import (
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/config"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/dto"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/httperr"
	"golang.org/x/crypto/bcrypt"
)

type EmployeeRepository interface {
	FindEmployeeByRegistry(registry string) (*dto.EmployeeDto, *httperr.HttpError)
	ListEmployees() (*[]dto.EmployeeDto, *httperr.HttpError)
	CreateEmployee(dto *dto.CreateEmployeeDto) *httperr.HttpError
	AuthenticateEmployee(dto *dto.AuthenticateEmployeeDto) (*Employee, *httperr.HttpError)
}

type Employee struct {
	Registry      string
	Fullname      string
	Email         string
	Sector        string
	Unit          string
	Administrator bool
	Password      string
	Feedbacks     []Feedback
}

func NewEmployee(registry, fullname, email, sector, unit, password string, administrator bool) *Employee {
	employee := Employee{
		Registry:      registry,
		Fullname:      fullname,
		Email:         email,
		Sector:        sector,
		Unit:          unit,
		Administrator: administrator,
		Password:      password,
	}

	employee.hashPassword()

	return &employee
}

func (e *Employee) hashPassword() {
	hash, _ := bcrypt.GenerateFromPassword([]byte(e.Password), 14)

	e.Password = string(hash)
}

func (e *Employee) ComparePassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(e.Password), []byte(password))

	return err == nil
}

func (e *Employee) Authenticate() (string, *httperr.HttpError) {
	jwtSecret := config.GetConfig().JwtSecret

	claims := jwt.MapClaims{
		"registry": e.Registry,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", httperr.NewInternalServerError("erro ao gerar o token JWT")
	}

	return signedToken, nil
}
