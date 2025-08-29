package backend

import (
	"context"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/labstack/echo/v4"
	"github.com/sirupsen/logrus"
	"github.com/taskmangler/taskmangler/src/backend/db"
	"github.com/taskmangler/taskmangler/src/frontend"
)

func addDb(database *db.Queries) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.Set("db", database)
			return next(c)
		}
	}
}

func Start() error {
	bind := os.Getenv("TM_BIND")
	if bind == "" {
		logrus.Warn("No `TM_BIND` address specified, defaulting to :8080")
		bind = ":8080"
	}

	dbUri := os.Getenv("TM_DATABASE_URI")
	if dbUri == "" {
		logrus.Fatal("No `TM_DATABASE_URI` specified, cannot start")
	}

	conn, err := pgx.Connect(context.Background(), dbUri)
	if err != nil {
		logrus.WithError(err).Fatal("Failed to connect to database")
	}
	defer conn.Close(context.Background())

	e := echo.New()

	e.HideBanner = true
	e.HidePort = true

	database := db.New(conn)

	e.Use(frontend.Serve)
	e.Use(addDb(database))

	logrus.Infof("Starting server on %s", bind)

	return e.Start(bind)
}
