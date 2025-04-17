# Heartbeat Analytics Platform

Heartbeat Analytics is a real-time analytics platform built with a microservices architecture using NestJS. The platform allows tracking and analyzing user behavior on websites through events.

## Dashboard

### Metrics Overview
![Dashboard Overview](./docs/images/dashboard-overview-top.png)

*Dashboard showing key metrics including unique visitors, total visits, pageviews, bounce rate, and average visit duration*

### Detailed Analysis
![Dashboard Details](./docs/images/dashboard-details.png)

*Detailed visualization showing traffic sources, exit pages, geographic distribution, and device/browser data*

**Front-End Repository:** https://github.com/PGabriel20/heartbeat-analytics-client

## Dashboard Key Features

- **Metrics**:
  - Unique visitors
  - Total visits
  - Total pageviews
  - Views per visit
  - Bounce rate
  - Average visit duration

- **Source Analysis**:
  - Direct traffic
  - Organic search (Google)
  - Referrals (Hacker News, Twitter, GitHub)

- **Geographic Data**:
  - City distribution
  - Global coverage
  - Regional analysis

- **Technical Information**:
  - Browser distribution
  - Device types
  - Operating systems

## Architecture

The project consists of three main components:

### 1. Tracking Script (`heartbeat.js`)

A lightweight JavaScript script that can be embedded in any website to track user events:

- Automatically tracks pageviews
- Captures user and session information
- Collects device and browser data
- Sends events to the events service via HTTP

### 2. Events Service (`@apps/events`)

Microservice responsible for receiving and processing raw events:

- Receives HTTP events from the tracking script
- Enriches events with additional information (geolocation, device info)
- Validates and normalizes event data
- Publishes processed events to RabbitMQ
- Stores raw events in PostgreSQL

### 3. Analytics Service (`@apps/analytics`)

Microservice responsible for processing and aggregating metrics:

- Consumes events from RabbitMQ
- Maintains visitor and session state
- Calculates and stores metric history
- Provides API for querying metrics
- Stores aggregated metrics in PostgreSQL

## Technologies Used

- NestJS (Framework)
- PostgreSQL (Database)
- RabbitMQ (Message Broker)
- TypeORM (ORM)
- Docker & Docker Compose
- TypeScript

## How to Run

### Prerequisites

- Docker and Docker Compose
- Node.js (v16+)
- pnpm (recommended) or npm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/heartbeat-analytics.git
cd heartbeat-analytics
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the project root:
```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=heartbeat

# Application
PORT=3000
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/heartbeat
```

### Running with Docker

1. Start the containers:
```bash
docker-compose up -d
```

2. Run database migrations:
```bash
pnpm migration:run
```

3. Services will be available at:
- Events Service: http://localhost:3000
- Analytics Service: http://localhost:3001

### Testing the API

The project includes an `api.http` file that can be used with VS Code's REST Client extension to test the endpoints:

```http
### Send event
POST http://localhost:3000/events
Content-Type: application/json

{
  "event_type": "pageview",
  "visitor_id": "123",
  "session_id": "456",
  "timestamp": "2024-04-17T00:00:00.000Z",
  "domain": "example.com"
}

### Query metrics
GET http://localhost:3001/analytics/metrics?siteId=123
```

## Integrating the Tracking Script

Add the following code to your website:

```html
<script src="https://your-domain.com/heartbeat.js"></script>
<script>
  Heartbeat.init({
    domain: 'your-domain.com'
  });
</script>
```

## Project Structure

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```


## Roadmap

As following features are planned for future implementation:

### Resiliência e Escalabilidade
- **Circuit Breaker**: Implementation of circuit breaker pattern for better fault tolerance
- **Replicação de Banco de Dados**: Separation between Master (Write) and Réplicas (Read) for better performance
- **API Gateway**: Centralization of request routing and security policies

### Observabilidade
- **Logging Aprimorado**: 
  - Implementation of structured logging
  - Centralized logs aggregation
  - Request tracing between services
  - Distributed tracing

### Performance
- Queries optimization
- Implementation of caching

### Segurança
- Rate limiting
- Improved authentication and authorization
- Protection against DDoS


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
