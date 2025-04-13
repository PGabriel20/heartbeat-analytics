import { NestFactory } from '@nestjs/core';
import { EventsModule } from './events.module';

async function bootstrap() {
  const app = await NestFactory.create(EventsModule);
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
