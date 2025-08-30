package users

import (
	"github.com/labstack/echo/v4"
	"github.com/taskmangler/taskmangler/src/backend/auth"
)

func GetAccessToken(c echo.Context) error {
	session := c.Get("session").(*auth.Session)
	auth := c.Get("auth").(*auth.AuthManager)

	token, err := auth.GetAccessToken(session)
	if err != nil {
		return c.JSON(500, map[string]string{"error": "failed to create access token"})
	}

	return c.JSON(200, map[string]string{
		"token": token,
		"type":  "access",
	})
}
