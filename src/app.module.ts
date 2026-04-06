import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { RidesModule } from './rides/rides.module';
import { DriverModule } from './driver/driver.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Auth } from './auth/entity/auth.entity';
import { Ride } from './rides/entity/rides.entity';
import { Driver } from './driver/entity/driver.entity';


@Module({
  imports: [
    AuthModule, DriverModule, RidesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([Auth, Ride, Driver]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL')
        if (!databaseUrl) {
          console.error('[TypeORM] DATABASE_URL is not set!');
          throw new Error('DATABASE_URL environment variable is not defined');
        }

        console.log('[TypeORM] Connecting to database...');
        return {
          type: 'postgres',
          url: databaseUrl, // preferred
          // fallback if you want separate env vars
          //host: configService.get<string>('DB_HOST'),
          //port: parseInt(configService.get<string>('DB_PORT') || '5432'),
          //username: configService.get<string>('DB_USERNAME'),
          //password: configService.get<string>('DB_PASSWORD'),
          //database: configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true, // ❗ turn OFF in production
          //logging: process.env.NODE_ENV !== 'production',
  
          ssl: process.env.NODE_ENV === 'production' 
          ? { rejectUnauthorized: false } 
          : false,
          extra: {
              max: 5, // Reduced for connection pooler (less aggressive)
              min: 1,
              idleTimeoutMillis: 20000,
              connectionTimeoutMillis: 15000,
              statement_timeout: 30000,
              query_timeout: 30000,
            },
            retryAttempts: 5,
            retryDelay: 2000,
        }
      },
    }),
    AuthModule,
    RidesModule,
    DriverModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}