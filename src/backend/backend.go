package backend

import (
	"context"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/labstack/echo/v4"
	"github.com/sirupsen/logrus"
	"github.com/taskmangler/taskmangler/src/backend/auth"
	"github.com/taskmangler/taskmangler/src/backend/db"
	"github.com/taskmangler/taskmangler/src/backend/hash"
	"github.com/taskmangler/taskmangler/src/backend/routes/users"
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

func addAuth(am *auth.AuthManager) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.Set("auth", am)
			return next(c)
		}
	}
}

func bootstrapAdminUser(database *db.Queries) error {
	username := os.Getenv("TM_BOOTSTRAP_ADMIN_USER")
	password := os.Getenv("TM_BOOTSTRAP_ADMIN_PASSWORD")

	if username == "" || password == "" {
		logrus.Info("No bootstrap admin user configured, skipping")
		return nil
	}

	_, err := database.GetUser(context.Background(), username)
	if err != nil && err != pgx.ErrNoRows {
		return err
	}
	if err == nil {
		logrus.Infof("Admin user %s already exists, skipping bootstrap", username)
		return nil
	}

	passwordHash, err := hash.Hash(password)
	if err != nil {
		return err
	}

	logrus.Infof("Creating bootstrap admin user %s", username)
	_, err = database.CreateUser(context.Background(), db.CreateUserParams{
		Username:     username,
		PasswordHash: passwordHash,
		Admin:        true,
	})

	return err
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

	if os.Getenv("TM_BOOTSTRAP") == "true" {
		logrus.Info("Bootstrapping admin user")
		err := bootstrapAdminUser(database)
		if err != nil {
			logrus.WithError(err).Fatal("Failed to bootstrap admin user")
		}
	}

	am, err := auth.New(database)
	if err != nil {
		logrus.WithError(err).Fatal("Failed to initialize auth manager")
	}

	e.Use(frontend.Serve)
	e.Use(addDb(database))
	e.Use(addAuth(am))

	e.POST("/api/users/login", users.Login)
	e.POST("/api/users/@me/sessions", users.GetAccessToken, auth.RequireRefreshToken)
	e.GET("/api/users/@me", users.GetSelfUser, auth.RequireAccessToken)
	e.POST("/api/users", users.CreateUser, auth.RequireAccessToken, auth.RequireAdmin)
	e.GET("/api/users", users.ListUsers, auth.RequireAccessToken, auth.RequireAdmin)

	logrus.Infof("Starting server on %s", bind)

	return e.Start(bind)
}
