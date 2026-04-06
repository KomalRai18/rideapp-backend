import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'https://rideapp-frontend.vercel.app'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Accept','X-Requested-With'],
  credentials: true,
});

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

// let app: any;

// async function bootstrap() {
//   if (!app) {
//     app = await NestFactory.create(AppModule);

//     app.enableCors({
//       origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
//         const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'https://rideapp-frontend.vercel.app'];
//         if (!origin || allowedOrigins.includes(origin)) {
//           callback(null, true);
//         } else {
//           callback(new Error('Not allowed by CORS'));
//         }
//       },
//       methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
//       allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
//       credentials: true,
//     });

//     app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
//     await app.init();
//   }
//   return app;
// }

// // Export default handler for Vercel
// export default async function handler(req: any, res: any) {
//   const nestApp = await bootstrap();
//   const server = nestApp.getHttpAdapter().getInstance();
//   return server(req, res);
// }