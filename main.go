package main

import (
	"os"

	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
	"github.com/taskmangler/taskmangler/src/backend"
)

func init() {
	logrus.SetFormatter(&logrus.TextFormatter{
		FullTimestamp: true,
	})

	if err := godotenv.Load(); err != nil {
		if os.IsNotExist(err) {
			logrus.Warn("No .env file not found, relying on environment variables")
		} else {
			logrus.Error("Error loading .env file:", err)
		}
	}

	if os.Getenv("ENV") == "production" {
		logrus.SetFormatter(&logrus.JSONFormatter{})
		logrus.SetLevel(logrus.InfoLevel)
		logrus.Info("TaskMangler running in production mode")
	} else {
		logrus.SetLevel(logrus.DebugLevel)
		logrus.Info("TaskMangler running in development mode")
	}
}

func main() {
	if err := backend.Start(); err != nil {
		logrus.Fatal("Failed to start backend:", err)
	}
}
