package frontend

import "github.com/labstack/echo/v4"

// TODO: Implement actual frontend serving logic
func Serve(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		return next(c)
	}
}
