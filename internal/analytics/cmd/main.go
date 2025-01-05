package main

import (
	"fmt"
	"log"

	"github.com/PGabriel20/heartbeat-analytics/internal/common/rabbitmq"
	"github.com/rabbitmq/amqp091-go"
)

func main() {
	rmq, err := rabbitmq.OpenConnection("guest", "guest", "rabbitmq", "5672")
	if err != nil {
		log.Fatalf("Error connecting to RabbitMQ: %v", err)
	}
	defer rmq.Close()

	out := make(chan amqp091.Delivery)
	consumerKey := "analytics-service-consumer"

	consumer, err := rabbitmq.NewRabbitMQConsumer(rmq)
	if err != nil {
		log.Fatalf("Error starting consumer: %v", err)
	}
	
	err = consumer.Consume("events-queue", consumerKey, out)
	if err != nil {
		log.Fatalf("Error consuming queue: %v", err)
	} else {
		log.Printf("Consuming")
	}

	go func() {
		for msg := range out {
			fmt.Printf("Received message: %s\n", string(msg.Body))
			msg.Ack(false) // Acknowledge the message
		}
	}()

	select {}
}