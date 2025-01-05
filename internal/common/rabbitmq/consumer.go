package rabbitmq

import (
	"fmt"

	amqp "github.com/rabbitmq/amqp091-go"
)

type RabbitMQConsumer struct {
	RabbitMQ RabbitMQ
}

func NewRabbitMQConsumer(rabbitmq *RabbitMQ) (*RabbitMQConsumer, error) {
	return &RabbitMQConsumer{RabbitMQ: *rabbitmq}, nil
}

// Consume sets up a consumer on the specified queue and sends messages to the output channel
func (c *RabbitMQConsumer) Consume(queueName string, consumerKey string, out chan<- amqp.Delivery) error {
	msgs, err := c.RabbitMQ.Channel.Consume(
		queueName,
		consumerKey,
		false, // auto-ack
		false, // exclusive
		false, // no-local (not used by RabbitMQ)
		false, // no-wait
		nil,   // arguments
	)
	if err != nil {
		return fmt.Errorf("failed to start consuming: %w", err)
	}
	go func() {
		for msg := range msgs {
			out <- msg
		}
	}()
	return nil
}