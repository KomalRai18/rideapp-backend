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
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([Auth, Ride, Driver]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        
        return {
          type: 'postgres',
          url: databaseUrl,
          autoLoadEntities: true,
          synchronize: false, // OFF in production
          logging: process.env.NODE_ENV !== 'production', // Only log in dev
          ssl: {
            rejectUnauthorized: false,
          },
          extra: {
            max: 20, // Increased from 1
            min: 2,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
          },
          retryAttempts: 3,
          retryDelay: 1000,
        };
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
