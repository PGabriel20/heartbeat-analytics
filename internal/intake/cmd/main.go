package main

import (
	"github.com/PGabriel20/heartbeat-analytics/internal/common"
	"github.com/PGabriel20/heartbeat-analytics/internal/intake/infra/handler"
)

func main() {
	cfg := config{
		addr: ":8080",
	}

	logger := common.NewLogger()

	healthHandler := handler.NewHealthHandler()
	eventHandler := handler.NewEventHandler()

	app := &application{
		config: cfg,
		logger: logger,
		healthHandler: healthHandler,
		eventHandler: eventHandler,
	}

	mux := app.mount()

	logger.Fatal(app.run(mux))
}
