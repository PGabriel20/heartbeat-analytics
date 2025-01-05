package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/PGabriel20/heartbeat-analytics/internal/common/rabbitmq"
)

type Event struct {
	EventType string 	`json:"event_type"`
	VisitorId string	`json:"visitor_id"`
	SessionId string	`json:"session_id"`
}


type EventHandler struct {
	Publisher *rabbitmq.RabbitMQPublisher
}

func NewEventHandler(publisher *rabbitmq.RabbitMQPublisher) *EventHandler {
	return &EventHandler{
		Publisher: publisher,
	}
}

func (h *EventHandler) IntakeEvent(w http.ResponseWriter, r *http.Request) {
	event := Event{
		EventType: "pageview",
		VisitorId: "123",
		SessionId: "456",
	}

	body, err := json.Marshal(event)
	if err != nil {
		log.Fatalf("Failed to marshal event: %v ", err)
	}
 
	// Publish a message
	err = h.Publisher.Publish("events-exchange", "events.intake", body)
	if err != nil {
		log.Fatalf("Error publishing message: %v", err)
	} else {
		log.Printf("Published event from inside handler: %s", body)
	}

	// Respond with success
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

