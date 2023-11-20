package main

import (
	"fmt"
	"net/http"

	_ "github.com/jackc/pgx/v4/stdlib"
	"github.com/kelseyhightower/envconfig"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
)

func main() {
	cfg := Config{}
	err := envconfig.Process("API", &cfg)
	if err != nil {
		panic(err)
	}

	e := echo.New()
	e.Logger.SetLevel(log.DEBUG)
	e.Use(middleware.CORS())
	e.Use(middleware.Recover())
	e.Use(middleware.Logger())

	e.GET("/health", func(c echo.Context) error {
		return c.NoContent(http.StatusOK)
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
