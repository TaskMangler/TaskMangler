package users

import (
	"github.com/labstack/echo/v4"
	"github.com/taskmangler/taskmangler/src/backend/db"
)

func ListUsers(c echo.Context) error {
	database := c.Get("db").(*db.Queries)
	users, err := database.ListUsers(c.Request().Context())
	if err != nil {
		return c.JSON(500, map[string]string{"error": "failed to list users"})
	}

	type userResponse struct {
		Username string `json:"username"`
		Admin    bool   `json:"admin"`
	}

	var resp []userResponse
	for _, u := range users {
		resp = append(resp, userResponse{
			Username: u.Username,
			Admin:    u.Admin,
		})
	}

	return c.JSON(200, resp)
}
