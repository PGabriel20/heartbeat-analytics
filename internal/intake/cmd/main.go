package main

import (
	"log"

	"github.com/PGabriel20/heartbeat-analytics/internal/common/rabbitmq"
	"github.com/PGabriel20/heartbeat-analytics/internal/intake/handler"
)

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

	publisher, err := rabbitmq.NewRabbitMQPublisher(rmq)
	if err != nil {
		log.Fatalf("Failed to build publisher: %v", err)
	}

	healthHandler := handler.NewHealthHandler()
	eventHandler := handler.NewEventHandler(publisher)

	app := &application{
		config: cfg,
		healthHandler: healthHandler,
		eventHandler: eventHandler,
	}

	mux := app.mount()
	log.Fatal(app.run(mux))
}
