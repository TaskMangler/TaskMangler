package backend

import (
	"os"

	"github.com/labstack/echo/v4"
	"github.com/sirupsen/logrus"
	"github.com/taskmangler/taskmangler/src/frontend"
)

func Start() error {
	bind := os.Getenv("TM_BIND")

	if bind == "" {
		logrus.Warn("No `TM_BIND` address specified, defaulting to :8080")
		bind = ":8080"
	}

	e := echo.New()

	e.HideBanner = true
	e.HidePort = true

	e.Use(frontend.Serve)

	logrus.Infof("Starting server on %s", bind)

	return e.Start(bind)
}
