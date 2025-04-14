import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AnalyticsModule } from './analytics.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AnalyticsModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://heartbeat:heartbeat123@rabbitmq:5672'],
      queue: 'analytics_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.listen();
  console.log('Analytics microservice is listening');
}
bootstrap();
