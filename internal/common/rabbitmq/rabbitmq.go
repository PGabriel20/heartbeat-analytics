package rabbitmq

import (
	"fmt"

	amqp "github.com/rabbitmq/amqp091-go"
)

type RabbitMQ struct {
	Connection *amqp.Connection
	Channel    *amqp.Channel
}

func OpenConnection(user, pass, host, port string) (*RabbitMQ, error) {
	address := fmt.Sprintf("amqp://%s:%s@%s:%s/", user, pass, host, port)

	conn, err := amqp.Dial(address)

	if err != nil {
		panic(err)
	}

	ch, err := conn.Channel()

	if err != nil {
		panic(err)
	}

	return &RabbitMQ{
		Connection: conn,
		Channel: ch,
	}, nil
}

// DeclareExchange declares an exchange with the specified name and type
func (r *RabbitMQ) DeclareExchange(exchangeName, exchangeType string) error {
	err := r.Channel.ExchangeDeclare(
		exchangeName,
		exchangeType, // "direct", "fanout", "topic", "headers"
		true,         // durable
		false,        // auto-deleted
		false,        // internal
		false,        // no-wait
		nil,          // arguments
	)

	if err != nil {
		return fmt.Errorf("failed to declare exchange: %w", err)
	}

	return nil
}

// DeclareQueue declares a queue with the specified name
func (r *RabbitMQ) DeclareQueue(queueName string) (amqp.Queue, error) {
	queue, err := r.Channel.QueueDeclare(
		queueName,
		true,  // durable
		false, // delete when unused
		false, // exclusive
		false, // no-wait
		nil,   // arguments
	)
	if err != nil {
		return amqp.Queue{}, fmt.Errorf("failed to declare queue: %w", err)
	}
	return queue, nil
}

// BindQueue binds a queue to an exchange with a routing key
func (r *RabbitMQ) BindQueue(queueName, exchangeName, routingKey string) error {
	err := r.Channel.QueueBind(
		queueName,
		routingKey,
		exchangeName,
		false, // no-wait
		nil,   // arguments
	)
	if err != nil {
		return fmt.Errorf("failed to bind queue: %w", err)
	}
	return nil
}

// Publish publishes a message to the specified exchange with a routing key
func (r *RabbitMQ) Publish(exchangeName, routingKey string, body []byte) error {
	err := r.Channel.Publish(
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

// Consume sets up a consumer on the specified queue and sends messages to the output channel
func (r *RabbitMQ) Consume(queueName string, consumerKey string, out chan<- amqp.Delivery) error {
	msgs, err := r.Channel.Consume(
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

// Close cleans up the connection and channel
func (r *RabbitMQ) Close() {
	if r.Channel != nil {
		r.Channel.Close()
	}
	if r.Connection != nil {
		r.Connection.Close()
	}
}