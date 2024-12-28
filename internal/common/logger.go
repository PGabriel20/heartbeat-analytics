package common

import (
	"log"
	"os"
)

// Logger is a simple custom logger.
var Logger *log.Logger

func init() {
    // Initialize the logger with a log file or output to stdout.
    Logger = log.New(os.Stdout, "[COMMON] ", log.LstdFlags)
}

// LogInfo logs an info message.
func LogInfo(message string) {
    Logger.Println("INFO: " + message)
}

// LogError logs an error message.
func LogError(message string) {
    Logger.Println("ERROR: " + message)
}
