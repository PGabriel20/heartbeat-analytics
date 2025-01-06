package broker

type Consumer interface {
	Consume(queue string, handler func([]byte) error) error
}

type Publisher interface {
	Publish(exchange, routingKey string, body []byte) error
}