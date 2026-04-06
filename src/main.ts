import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const CORS_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4000',
  'https://rideapp-frontend.vercel.app',
];

// ── Vercel: cached serverless handler ────────────────────────────────────────
let cachedServer: any;

async function buildServer() {
  if (cachedServer) return cachedServer;

  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter, {
    logger: ['error', 'warn', 'log'],
  });

  app.enableCors({
    origin: CORS_ORIGINS,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();

  cachedServer = expressApp;
  return cachedServer;
}

// ── Railway / Local: long-running server ─────────────────────────────────────
async function startServer() {
  try {
    console.log('[Startup] Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT || 4000,
      HAS_DATABASE_URL: !!process.env.DATABASE_URL,
      RAILWAY_ENVIRONMENT: !!process.env.RAILWAY_ENVIRONMENT_NAME,
    });

    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    console.log('[Startup] NestFactory created successfully');

    app.enableCors({
      origin: CORS_ORIGINS,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
      credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    const port = process.env.PORT || 4000;
    await app.listen(port, '0.0.0.0');
    console.log(`[Startup] Application is running on port ${port}`);
  } catch (err) {
    console.error('[Startup Error]', err);
    process.exit(1);
  }
}

// ── Entry point decision ──────────────────────────────────────────────────────
// On Vercel: VERCEL env var is set → export the serverless handler.
// On Railway / local: start a real HTTP server.
if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

// Vercel serverless export (ignored on Railway)
export default async function handler(req: any, res: any) {
  try {
    const server = await buildServer();
    return server(req, res);
  } catch (err) {
    console.error('Bootstrap error:', err);
    res.status(500).json({ message: 'Internal server error', error: String(err) });
  }
}
