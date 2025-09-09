package users

import (
	"github.com/labstack/echo/v4"
	"github.com/taskmangler/taskmangler/src/backend/auth"
)

func GetSelfUser(c echo.Context) error {
	session := c.Get("session").(*auth.Session)

	type userResponse struct {
		Username string `json:"username"`
		Admin    bool   `json:"admin"`
	}

	return c.JSON(200, userResponse{
		Username: session.Username,
		Admin:    session.Admin,
	})
}
