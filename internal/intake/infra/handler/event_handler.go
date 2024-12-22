package handler

import "net/http"

type EventHandler struct {}

func NewEventHandler() *EventHandler {
	return &EventHandler{}
}

func (h *EventHandler) IntakeEvent(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

