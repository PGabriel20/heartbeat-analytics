import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { EventsModule } from './events.module';

async function bootstrap() {
  const app = await NestFactory.create(EventsModule);
  
  // Configuração global de CORS
  app.enableCors({
    origin: '*', // Em produção, você deve restringir isso
    methods: 'POST',
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Adiciona validação global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Prefixo global para todas as rotas
  app.setGlobalPrefix('v1');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Events service is running on port ${port}`);
}
bootstrap();
