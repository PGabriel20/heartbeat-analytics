package rabbitmq

import (
	"fmt"

	amqp "github.com/rabbitmq/amqp091-go"
)

type RabbitMQPublisher struct {
	RabbitMQ RabbitMQ
}

func NewRabbitMQPublisher(rabbitmq *RabbitMQ) (*RabbitMQPublisher, error) {
	return &RabbitMQPublisher{RabbitMQ: *rabbitmq}, nil
}

// Publish publishes a message to the specified exchange with a routing key
func (p *RabbitMQPublisher) Publish(exchangeName, routingKey string, body []byte) error {
	err := p.RabbitMQ.Channel.Publish(
		exchangeName,
		routingKey,
		false, // mandatory
		false, // immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        body,
		},
	)
	if err != nil {
		return fmt.Errorf("failed to publish message: %w", err)
	}
	return nil
}
