import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Auth } from '../auth/entity/auth.entity';
import { Ride } from '../rides/entity/rides.entity';
import { Driver } from '../driver/entity/driver.entity';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: true,
    entities: [Auth, Ride, Driver],
    migrations: [__dirname + '/migrations/*.ts'],
    subscribers: [],
    ssl: {
        rejectUnauthorized: false,
    },
});
