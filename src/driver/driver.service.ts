import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './entity/driver.entity';
import { CreateDriverDto } from './dtos/create-driver.dto';

@Injectable()
export class DriverService {
    constructor(
        @InjectRepository(Driver)
        private driverRepository: Repository<Driver>,
    ) { }

    async createDriver(createDriverDto: CreateDriverDto): Promise<Driver> {
        const driver = this.driverRepository.create(createDriverDto);
        return await this.driverRepository.save(driver);
    }

    async getAllDrivers(): Promise<Driver[]> {
        return await this.driverRepository.find();
    }
}
