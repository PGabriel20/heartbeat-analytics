package handler

import (
	"net/http"
)

type HealthHandler struct{
}

func NewHealthHandler() *HealthHandler {
	return &HealthHandler{
	}
}

//Does not have access to application
func (h *HealthHandler) CheckHealth(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}