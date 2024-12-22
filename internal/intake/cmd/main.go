package main

import (
	"log"

	"github.com/PGabriel20/heartbeat-analytics/internal/intake/infra/handler"
)

func main() {
	cfg := config{
		addr: ":8080",
	}

	healthHandler := handler.NewHealthHandler()
	eventHandler := handler.NewEventHandler()

	app := &application{
		config: cfg,
		healthHandler: healthHandler,
		eventHandler: eventHandler,
	}

	mux := app.mount()

	log.Fatal(app.run(mux))
}
