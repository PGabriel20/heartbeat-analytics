package handler

import (
	"net/http"

	"github.com/PGabriel20/heartbeat-analytics/internal/common"
)

type HealthHandler struct{
	logger *common.ZapLogger
}

func NewHealthHandler(logger *common.ZapLogger) *HealthHandler {
	return &HealthHandler{
		logger: logger,
	}
}

//Does not have access to application
func (h *HealthHandler) CheckHealth(w http.ResponseWriter, r *http.Request) {
	h.logger.Info("Health check")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}