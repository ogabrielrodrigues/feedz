package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/dto"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/application/httperr"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/database"
	"github.com/ogabrielrodrigues/hackaton-minerva/server/internal/domain/entity"
)

type employeeRepository struct {
	database *pgxpool.Pool
}

func NewEmployeeRepository(database *pgxpool.Pool) entity.EmployeeRepository {
	return &employeeRepository{database}
}

func (er *employeeRepository) FindEmployeeByRegistry(registry string) (*dto.EmployeeDto, *httperr.HttpError) {
	ctx := context.Background()

	tx, err := er.database.Begin(ctx)
	if err != nil {
		tx.Rollback(ctx)
		return nil, httperr.NewInternalServerError(err.Error())
	}

	row := tx.QueryRow(ctx, `select * from employee where registry = $1`, registry)

	employee := dto.EmployeeDto{}
	var _p string

	if err := row.Scan(
		&employee.Registry,
		&employee.Fullname,
		&employee.Email,
		&employee.Sector,
		&employee.Unit,
		&employee.Administrator,
		&_p); err != nil {
		tx.Rollback(ctx)
		return nil, httperr.NewInternalServerError(err.Error())
	}

	rows, err := tx.Query(ctx,
		`select * from feedback f
		join employee e on f.employee_registry = e.registry
	 	where e.registry = $1`,
		registry)
	if err != nil {
		tx.Rollback(ctx)
		return nil, httperr.NewInternalServerError(err.Error())
	}

	feedbacks := []dto.FeedbackDto{}
	feedback := dto.FeedbackDto{}

	for rows.Next() {
		defer rows.Close()

		if err := row.Scan(
			&feedback.FeedbackID,
			&feedback.EmployeeRegistry,
			&feedback.Content,
			&feedback.Answered,
			&feedback.AnswerID,
			&feedback.SentAt); err != nil {
			tx.Rollback(ctx)
			return nil, httperr.NewInternalServerError(err.Error())
		}

		feedbacks = append(feedbacks, feedback)
	}

	if err := tx.Commit(ctx); err != nil {
		tx.Rollback(ctx)
		return nil, httperr.NewInternalServerError(err.Error())
	}

	employee.Feedbacks = feedbacks

	return &employee, nil
}

func (er *employeeRepository) ListEmployees() (*[]dto.EmployeeDto, *httperr.HttpError) {
	ctx := context.Background()

	rows, err := er.database.Query(ctx, `select * from employee`)
	if err != nil {
		return nil, httperr.NewInternalServerError(err.Error())
	}

	employees := []dto.EmployeeDto{}
	employee := dto.EmployeeDto{}
	var _p string

	for rows.Next() {
		defer rows.Close()

		if err := rows.Scan(
			&employee.Registry,
			&employee.Fullname,
			&employee.Email,
			&employee.Sector,
			&employee.Unit,
			&employee.Administrator,
			&_p); err != nil {
			return nil, httperr.NewInternalServerError(err.Error())
		}

		employees = append(employees, employee)
	}

	return &employees, nil
}

func (er *employeeRepository) CreateEmployee(dto *dto.CreateEmployeeDto) *httperr.HttpError {
	ctx := context.Background()

	employee := entity.NewEmployee(
		dto.Registry,
		dto.Fullname,
		dto.Email,
		dto.Sector,
		dto.Unit,
		dto.Password,
		dto.Administrator,
	)

	if _, err := er.database.Exec(ctx,
		`insert into employee (registry, fullname, email, sector, unit, administrator, password)
		values ($1, $2, $3, $4, $5, $6, $7)`,
		employee.Registry,
		employee.Fullname,
		employee.Email,
		employee.Sector,
		employee.Unit,
		employee.Administrator,
		employee.Password,
	); err != nil {
		return httperr.NewInternalServerError(err.Error())
	}

	return nil
}

func (er *employeeRepository) AuthenticateEmployee(dto *dto.AuthenticateEmployeeDto) (*entity.Employee, *httperr.HttpError) {
	ctx := context.Background()

	row := er.database.QueryRow(ctx,
		`select * from employee where email = $1`,
		dto.Email,
	)

	employee := entity.Employee{}

	if err := row.Scan(
		&employee.Registry,
		&employee.Fullname,
		&employee.Email,
		&employee.Sector,
		&employee.Unit,
		&employee.Administrator,
		&employee.Password); err != nil {
		if database.IsErrNoRows(err) {
			httperr.NewNotFoundError("funcionário não cadastrado com esse e-mail")
		}

		return nil, httperr.NewInternalServerError(err.Error())
	}

	if match := employee.ComparePassword(dto.Password); !match {
		httperr.NewForbiddenError("as senhas não coincidem")
	}

	return &employee, nil
}
