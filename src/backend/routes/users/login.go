package users

import (
	"github.com/labstack/echo/v4"
	"github.com/taskmangler/taskmangler/src/backend/auth"
)

func Login(c echo.Context) error {
	type request struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var req request
	if err := c.Bind(&req); err != nil {
		return c.JSON(400, map[string]string{"error": "invalid request"})
	}

	if req.Username == "" || req.Password == "" {
		return c.JSON(400, map[string]string{"error": "username and password are required"})
	}

	identifier := c.Request().Header.Get("User-Agent")

	auth := c.Get("auth").(*auth.AuthManager)

	token, err := auth.Login(req.Username, req.Password, identifier)
	if err != nil {
		return c.JSON(401, map[string]string{"error": "invalid username or password"})
	}

	return c.JSON(200, map[string]string{
		"token": token,
		"type":  "refresh",
	})
}
