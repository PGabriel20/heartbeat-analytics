import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { EventsModule } from './events.module';

async function bootstrap() {
  const app = await NestFactory.create(EventsModule);

  app.enableCors({
    origin: '*',
    methods: 'POST',
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('v1');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Events service is running on port ${port}`);
}
bootstrap();
