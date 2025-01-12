package logs

import (
	"log/slog"
	"os"
)

func InitLogger() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)
}
