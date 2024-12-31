package common

import (
	"go.uber.org/zap"
)


func NewLogger() *zap.SugaredLogger {
	logger := zap.Must(zap.NewProduction()).Sugar()
	defer logger.Sync()

	return logger
}
