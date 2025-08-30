package users

import (
	"github.com/labstack/echo/v4"
	"github.com/taskmangler/taskmangler/src/backend/auth"
)

func GetSelfUser(c echo.Context) error {
	session := c.Get("session").(*auth.Session)

	return c.JSON(200, map[string]string{
		"username": session.Username,
	})
}
