package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/antonve/activity-log/postgres"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	_ "github.com/jackc/pgx/v4/stdlib"
	"github.com/kelseyhightower/envconfig"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
)

type Log struct {
	ID       uuid.UUID `json:"id" validate:"required"`
	Content  string    `json:"content" validate:"required"`
	Category string    `json:"category" validate:"required"`
	DoneAt   time.Time `json:"done_at" validate:"required"`
}

func main() {
	cfg := Config{}
	err := envconfig.Process("API", &cfg)
	if err != nil {
		panic(err)
	}

	psql := postgres.New(initPostgres(cfg))
	validate := validator.New()

	e := echo.New()
	e.Logger.SetLevel(log.DEBUG)
	e.Use(middleware.CORS())
	e.Use(middleware.Recover())
	e.Use(middleware.Logger())

	e.GET("/health", func(c echo.Context) error {
		return c.NoContent(http.StatusOK)
	})

	e.POST("/logs", func(c echo.Context) error {
		l := &Log{}
		if err := c.Bind(l); err != nil {
			return err
		}

		if err := validate.Struct(l); err != nil {
			return err
		}

		psql.CreateLog(c.Request().Context(), postgres.CreateLogParams{
			ID:       l.ID,
			Content:  l.Content,
			Category: l.Category,
			DoneAt:   l.DoneAt,
		})

		return c.JSON(http.StatusCreated, l)
	})

	e.Logger.Fatal(e.Start(fmt.Sprintf(":%d", cfg.Port)))
}

type Config struct {
	Postgres struct {
		Host     string `required:"true"`
		Username string `required:"true"`
		Password string `required:"true"`
		Database string `required:"true"`
		SSLMode  string `required:"true"`
	}

	Port int `required:"true"`
}

func initPostgres(config Config) *sql.DB {
	cfg := &config.Postgres
	conn := fmt.Sprintf(
		"host=%s user=%s dbname=%s password=%s sslmode=%s",
		cfg.Host,
		cfg.Username,
		cfg.Database,
		cfg.Password,
		cfg.SSLMode,
	)
	psql, err := sql.Open("pgx", conn)
	if err != nil {
		panic(fmt.Errorf("failed opening connection to postgres: %v", err))
	}

	return psql
}
