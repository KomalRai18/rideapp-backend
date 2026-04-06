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
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'), // preferred
        // fallback if you want separate env vars
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') || '5432'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // ❗ turn OFF in production
        ssl: { rejectUnauthorized: false },
      }),
    }),
    AuthModule,
    RidesModule,
    DriverModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}