// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
// app.enableCors({
//   origin: (origin, callback) => {
//     const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
//   allowedHeaders: ['Content-Type','Authorization','Accept','X-Requested-With'],
//   credentials: true,
// });

//   app.useGlobalPipes(new ValidationPipe());

//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        // Add your frontend production URL here later, e.g. 'https://your-frontend.vercel.app'
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  // Important for Vercel: Do NOT call app.listen() here
  // Vercel will handle starting the server
  return app;
}

// Export the app so Vercel can use it
bootstrap().then((app) => {
  module.exports = app;   // ← This fixes the "No exports found" error
});