import { NestFactory } from '@nestjs/core';
import { EventsModule } from './events.module';

async function bootstrap() {
  const app = await NestFactory.create(EventsModule);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Events service running on port ${port}`);
}
bootstrap();
