# Heartbeat Analytics Platform

Heartbeat Analytics é uma plataforma de analytics em tempo real construída com arquitetura de microserviços usando NestJS. A plataforma permite rastrear e analisar o comportamento dos usuários em websites através de eventos.

## Arquitetura

O projeto é composto por três componentes principais:

### 1. Script de Rastreamento (`heartbeat.js`)

Um script leve de JavaScript que pode ser incorporado em qualquer website para rastrear eventos dos usuários:

- Rastreia automaticamente pageviews
- Captura informações do usuário e da sessão
- Coleta dados do dispositivo e navegador
- Envia eventos para o serviço de eventos via HTTP

### 2. Serviço de Eventos (`@apps/events`)

Microserviço responsável por receber e processar eventos brutos:

- Recebe eventos HTTP do script de rastreamento
- Enriquece eventos com informações adicionais (geolocalização, device info)
- Valida e normaliza dados dos eventos
- Publica eventos processados para o RabbitMQ
- Armazena eventos brutos no PostgreSQL

### 3. Serviço de Analytics (`@apps/analytics`)

Microserviço responsável por processar e agregar métricas:

- Consome eventos do RabbitMQ
- Mantém estado de visitantes e sessões
- Calcula métricas em tempo real
- Fornece API para consulta de métricas
- Armazena métricas agregadas no PostgreSQL

## Tecnologias Utilizadas

- NestJS (Framework)
- PostgreSQL (Banco de dados)
- RabbitMQ (Message Broker)
- TypeORM (ORM)
- Docker & Docker Compose
- TypeScript

## Como Executar

### Pré-requisitos

- Docker e Docker Compose
- Node.js (v16+)
- pnpm (recomendado) ou npm

### Configuração

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/heartbeat-analytics.git
cd heartbeat-analytics
```

2. Instale as dependências:
```bash
pnpm install
```

3. Crie um arquivo `.env` na raiz do projeto:
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

### Executando com Docker

1. Inicie os containers:
```bash
docker-compose up -d
```

2. Execute as migrações do banco de dados:
```bash
pnpm migration:run
```

3. Os serviços estarão disponíveis em:
- Events Service: http://localhost:3000
- Analytics Service: http://localhost:3001

### Testando a API

O projeto inclui um arquivo `api.http` que pode ser usado com a extensão REST Client do VS Code para testar as endpoints:

```http
### Enviar evento
POST http://localhost:3000/events
Content-Type: application/json

{
  "event_type": "pageview",
  "visitor_id": "123",
  "session_id": "456",
  "timestamp": "2024-04-17T00:00:00.000Z",
  "domain": "example.com"
}

### Consultar métricas
GET http://localhost:3001/analytics/metrics?siteId=123
```

## Integrando o Script de Rastreamento

Adicione o seguinte código ao seu website:

```html
<script src="https://seu-dominio.com/heartbeat.js"></script>
<script>
  Heartbeat.init({
    domain: 'seu-dominio.com'
  });
</script>
```

## Estrutura do Projeto

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

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
