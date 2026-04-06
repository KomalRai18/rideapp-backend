import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedServer: any;

async function bootstrap() {
  if (cachedServer) return cachedServer;

  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter, {
    logger: ['error', 'warn', 'log'],
  });

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:4000',
      'https://rideapp-frontend.vercel.app',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();

  cachedServer = expressApp;
  return cachedServer;
}

export default async function handler(req: any, res: any) {
  try {
    const server = await bootstrap();
    return server(req, res);
  } catch (err) {
    console.error('Bootstrap error:', err);
    res.status(500).json({ message: 'Internal server error', error: String(err) });
  }
}