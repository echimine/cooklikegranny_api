// main.ts
// essayer de faire du cache
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //enable cors policy
  app.enableCors();
  // Validation automatique
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // , forbidNonWhitelisted: true
  const port = process.env.PORT || 3001;

  // Serve les images depuis /public/uploads
  app.use(
    '/uploads',
    express.static(join(__dirname, '..', 'public', 'uploads')),
  );
  await app.listen(port);
}
bootstrap();
