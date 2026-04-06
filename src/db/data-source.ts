import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Auth } from '../auth/entity/auth.entity';
import { Ride } from '../rides/entity/rides.entity';
import { Driver } from '../driver/entity/driver.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false, // migrations recommended for prod
  logging: process.env.NODE_ENV !== 'production',
  entities: [Auth, Ride, Driver],
  migrations: [__dirname + '/migrations/*.ts'],
  ssl: { rejectUnauthorized: false },
  extra: {
    max: 5,
    min: 1,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 15000,
    statement_timeout: 30000,
    query_timeout: 30000,
  },
});
