import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ride } from './entity/rides.entity';
import { CreateRideDto } from './dtos/create-ride.dto';
import { EndRideDto } from './dtos/end-ride.dto';
import { Driver } from '../driver/entity/driver.entity';
import { FareType } from '../config/enums/fare.enum';

@Injectable()
export class RidesService {
    constructor(
        @InjectRepository(Ride)
        private ridesRepository: Repository<Ride>,
        @InjectRepository(Driver)
        private driverRepository: Repository<Driver>,
    ) { }

    async createRide(createRideDto: CreateRideDto): Promise<Ride> {
        const driver = await this.driverRepository.findOne({ where: { id: createRideDto.driverId } });
        if (!driver) {
            throw new NotFoundException('Driver not found');
        }

        const ride = this.ridesRepository.create({
            ...createRideDto,
            driver,
        });
        return await this.ridesRepository.save(ride);
    }

    async startRide(id: number): Promise<Ride> {
        const ride = await this.ridesRepository.findOne({ where: { id } });
        if (!ride) {
            throw new NotFoundException('Ride not found');
        }
        if (ride.startedAt) {
            throw new BadRequestException('Ride already started');
        }

        ride.startedAt = new Date();
        return await this.ridesRepository.save(ride);
    }

    async endRide(id: number, endRideDto: EndRideDto): Promise<Ride> {
        const ride = await this.ridesRepository.findOne({ where: { id } });
        if (!ride) {
            throw new NotFoundException('Ride not found');
        }
        if (!ride.startedAt) {
            throw new BadRequestException('Cannot end ride before starting');
        }
        if (ride.endedAt) {
            throw new BadRequestException('Ride already ended');
        }

        ride.endedAt = new Date();
        ride.distance = endRideDto.distance as number;
        ride.hours = endRideDto.hours as number;

        // Fare calculation
        let total = 0;
        const baseRate = Number(ride.baseRate) || 0;
        const perMileRate = Number(ride.perMileRate) || 0;
        const hourlyRate = Number(ride.hourlyRate) || 0;
        const distance = Number(ride.distance) || 0;
        const hours = Number(ride.hours) || 0;

        if (ride.fareType === FareType.MILEAGE) {
            total = baseRate + (distance * perMileRate);
        } else if (ride.fareType === FareType.HOURLY) {
            total = hours * hourlyRate;
        } else if (ride.fareType === FareType.FIXED) {
            total = baseRate;
        }

        ride.totalAmount = total;
        return await this.ridesRepository.save(ride);
    }

    async findAll(): Promise<Ride[]> {
        return await this.ridesRepository.find({ relations: ['driver'] });
    }

    async findOne(id: number): Promise<Ride> {
        const ride = await this.ridesRepository.findOne({ where: { id }, relations: ['driver'] });
        if (!ride) {
            throw new NotFoundException('Ride not found');
        }
        return ride;
    }
}
