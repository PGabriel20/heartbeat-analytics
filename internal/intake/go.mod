module github.com/PGabriel20/heartbeat-analytics/internal/intake

go 1.21.4

require (
	github.com/go-chi/chi/v5 v5.2.0 // indirect
	github.com/go-chi/cors v1.2.1 // indirect
	github.com/PGabriel20/heartbeat-analytics/internal/common v0.0.0 // indirect
)

replace (
	github.com/PGabriel20/heartbeat-analytics/internal/common => ../common
)
