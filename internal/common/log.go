package common

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type ZapLogger struct {
	logger *zap.SugaredLogger
}

func NewLogger() *ZapLogger {
	config := zap.NewProductionEncoderConfig()
	config.TimeKey = "timestamp"

	core := zapcore.NewCore(
		zapcore.NewJSONEncoder(config),             // Use JSON format for logs
		zapcore.AddSync(os.Stdout),                // Write logs to stdout
		zapcore.InfoLevel,                         // Log level
	)

	logger := zap.New(core).Sugar()
	return &ZapLogger{logger: logger}
}

func (z *ZapLogger) Info(args ...interface{}) {
	z.logger.Info(args)
}

func (z *ZapLogger) Error(args ...interface{}) {
	z.logger.Error(args)
}

func (z *ZapLogger) Fatal(args ...interface{}) {
	z.logger.Fatal(args)
}
