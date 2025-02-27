package handler

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"time"

	"github.com/PGabriel20/heartbeat-analytics/internal/common/broker"
	"github.com/PGabriel20/heartbeat-analytics/internal/intake/usecase"
)

type EventHandler struct {
	Publisher broker.Publisher
}

func NewEventHandler(publisher broker.Publisher) *EventHandler {
	return &EventHandler{
		Publisher: publisher,
	}
}

func (h *EventHandler) IntakeEvent(w http.ResponseWriter, r *http.Request) {
	var dto usecase.IntakeEventInputDto

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&dto)
	if err != nil {
		slog.Error(err.Error())
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	dto.Timestamp = time.Now().UTC().Format(time.RFC3339)
	dto.IP = r.RemoteAddr
	dto.UserAgent = r.Header.Get("User-Agent")

	usecase := usecase.NewIntakeEventUseCase(h.Publisher)
	err = usecase.Execute(dto)

	if err != nil {
		slog.Error(err.Error())
		http.Error(w, "Failed to process event", http.StatusInternalServerError)
		return
	}

	slog.Info("Event intaked successfully", slog.Any("event", dto))

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

