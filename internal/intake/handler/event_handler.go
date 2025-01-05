package handler

import (
	"net/http"
)

type EventHandler struct {
}

func NewEventHandler() *EventHandler {
	return &EventHandler{
	}
}

func (h *EventHandler) IntakeEvent(w http.ResponseWriter, r *http.Request) {
	// var dto usecase.IntakeEventInputDto
	// decoder := json.NewDecoder(r.Body)

	// if err := decoder.Decode(&dto); err != nil {
	// 	http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
	// 	return
	// }

	// dto.Timestamp = time.Now().UTC().Format(time.RFC3339)
	// dto.IP = r.RemoteAddr
	// dto.UserAgent = r.Header.Get("User-Agent")

	// intakeEvent := usecase.NewIntakeEventUseCase()

	// eventOutput, err := intakeEvent.Execute(dto)

	
	// if err != nil {
	// 	http.Error(w, "Failed to process event", http.StatusInternalServerError)
	// 	return
	// }

	// _, err := json.MarshalIndent(eventOutput, "", "  ")

	// if err != nil {
	// }


	// Respond with success
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

