package auth

import (
	"fmt"

	"github.com/labstack/echo/v4"
)

func RequireRefreshToken(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		authHeader := c.Request().Header.Get("Authorization")
		if authHeader == "" {
			return c.JSON(401, map[string]string{"error": "missing authorization header"})
		}

		var token string
		_, err := fmt.Sscanf(authHeader, "Bearer %s", &token)
		if err != nil {
			return c.JSON(401, map[string]string{"error": "invalid authorization header"})
		}

		session, err := parseRefreshToken(token)
		if err != nil {
			return c.JSON(401, map[string]string{"error": "invalid or expired token"})
		}

		c.Set("session", session)
		return next(c)
	}
}

func RequireAccessToken(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		authHeader := c.Request().Header.Get("Authorization")
		if authHeader == "" {
			return c.JSON(401, map[string]string{"error": "missing authorization header"})
		}

		var token string
		_, err := fmt.Sscanf(authHeader, "Bearer %s", &token)
		if err != nil {
			return c.JSON(401, map[string]string{"error": "invalid authorization header"})
		}

		session, err := parseAccessToken(token)
		if err != nil {
			return c.JSON(401, map[string]string{"error": "invalid or expired token"})
		}

		c.Set("session", session)
		return next(c)
	}
}

func RequireAdmin(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		sess := c.Get("session")
		if sess == nil {
			return c.JSON(500, map[string]string{"error": "session not found in context"})
		}

		session := sess.(*Session)
		if !session.Admin {
			return c.JSON(403, map[string]string{"error": "admin access required"})
		}
		return next(c)
	}
}
