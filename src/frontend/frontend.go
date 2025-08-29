package frontend

import (
	"embed"
	"strings"

	"github.com/labstack/echo/v4"
)

//go:embed dist
var distFS embed.FS

func detectContentType(path string) string {
	switch {
	case strings.HasSuffix(path, ".html"):
		return "text/html"
	case strings.HasSuffix(path, ".css"):
		return "text/css"
	case strings.HasSuffix(path, ".js"):
		return "application/javascript"
	case strings.HasSuffix(path, ".png"):
		return "image/png"
	case strings.HasSuffix(path, ".jpg"), strings.HasSuffix(path, ".jpeg"):
		return "image/jpeg"
	case strings.HasSuffix(path, ".svg"):
		return "image/svg+xml"
	}

	return "application/octet-stream"
}

// TODO: Implement actual frontend serving logic
func Serve(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		path := c.Request().URL.Path
		if strings.HasPrefix(path, "/api/") {
			return next(c)
		}

		data, err := distFS.ReadFile("dist" + path)
		if err != nil {
			data, err = distFS.ReadFile("dist/index.html")
			if err != nil {
				return echo.NewHTTPError(500, "Failed to load frontend")
			}

			return c.HTMLBlob(200, data)
		}

		return c.Blob(200, detectContentType(path), data)
	}
}
