package users

import (
	"github.com/labstack/echo/v4"
	"github.com/taskmangler/taskmangler/src/backend/db"
)

func DeleteUser(c echo.Context) error {
	username := c.Param("username")
	if username == "" {
		return c.JSON(400, map[string]string{"error": "username is required"})
	}

	database := c.Get("db").(*db.Queries)
	err := database.DeleteUser(c.Request().Context(), username)
	if err != nil {
		return c.JSON(500, map[string]string{"error": "failed to delete user"})
	}

	return c.NoContent(204)
}
