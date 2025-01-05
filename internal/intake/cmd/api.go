package main

import (
	"log"
	"net/http"
	"time"

	"github.com/PGabriel20/heartbeat-analytics/internal/intake/handler"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

//Api configuration
type application struct {
	config config
	healthHandler *handler.HealthHandler
	eventHandler *handler.EventHandler
}

type config struct {
	addr string
}

func(app *application) mount() http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	//r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	// Set a timeout value on the request context (ctx), that will signal
	// through ctx.Done() that the request has timed out and further
	// processing should be stopped.
	r.Use(middleware.Timeout(60 * time.Second))

	r.Route("/v1", func(r chi.Router) {
		r.Get("/health", app.healthHandler.CheckHealth)
		r.Post("/intake", app.eventHandler.IntakeEvent)
	}) 

	return r
}

func (app *application) run(mux http.Handler) error {
	srv := &http.Server{
		Addr: app.config.addr,
		Handler: mux,
	}

	log.Print("Starting server on " + app.config.addr)

	return srv.ListenAndServe()
}