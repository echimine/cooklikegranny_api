// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation automatique
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // , forbidNonWhitelisted: true

  // Serve les images depuis /public/uploads
  app.use(
    '/uploads',
    express.static(join(__dirname, '..', 'public', 'uploads')),
  );
  await app.listen(3000);
}
bootstrap();
