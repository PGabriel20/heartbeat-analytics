package main

import (
	"encoding/json"
	"log"

	"github.com/PGabriel20/heartbeat-analytics/internal/common/rabbitmq"
	"github.com/PGabriel20/heartbeat-analytics/internal/intake/handler"
)

type Event struct {
	EventType string 	`json:"event_type"`
	VisitorId string	`json:"visitor_id"`
	SessionId string	`json:"session_id"`
}

func main() {
	cfg := config{
		addr: ":8080",
	}

	//Setup connection
	rmq, err := rabbitmq.OpenConnection("guest", "guest", "rabbitmq", "5672")
	if err != nil {
		log.Fatalf("Error connecting to RabbitMQ: %v", err)
	}
	defer rmq.Close()

	exchange := "events-exchange"

	//Declare echange
	err = rmq.DeclareExchange(exchange, "direct")
	if err != nil {
		log.Fatalf("Error declaring exchange: %v", err)
	}

		//Declare queue
	queue, err := rmq.DeclareQueue("events-queue")
	if err != nil {
		log.Fatalf("Error declaring queue: %v", err)
	}

	// Bind queue to exchange with a routing key
	err = rmq.BindQueue(queue.Name, exchange, "events.intake")
	if err != nil {
		log.Fatalf("Error binding queue: %v", err)
	}

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
	err = rmq.Publish(exchange, "events.intake", body)
	if err != nil {
		log.Fatalf("Error publishing message: %v", err)
	} else {
		log.Printf("Published event: %s", body)
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
