package users

import (
	"github.com/labstack/echo/v4"
	"github.com/taskmangler/taskmangler/src/backend/db"
	"github.com/taskmangler/taskmangler/src/backend/hash"
)

func CreateUser(c echo.Context) error {
	var data struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := c.Bind(&data); err != nil {
		return c.JSON(400, map[string]string{"error": "invalid request"})
	}
	if data.Username == "" || data.Password == "" {
		return c.JSON(400, map[string]string{"error": "username and password are required"})
	}

	hash, err := hash.Hash(data.Password)
	if err != nil {
		return c.JSON(500, map[string]string{"error": "failed to hash password"})
	}

	database := c.Get("db").(*db.Queries)
	user, err := database.CreateUser(c.Request().Context(), db.CreateUserParams{
		Username:     data.Username,
		PasswordHash: hash,
		Admin:        false,
	})
	if err != nil {
		return c.JSON(500, map[string]string{"error": "failed to create user"})
	}

	return c.JSON(201, map[string]any{
		"username": user.Username,
		"admin":    user.Admin,
	})
}
