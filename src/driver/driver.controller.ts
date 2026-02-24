import { Controller, Get, Post, Body } from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dtos/create-driver.dto';

@Controller('driver')
export class DriverController {
    constructor(private readonly driverService: DriverService) { }

    @Post()
    async createDriver(@Body() createDriverDto: CreateDriverDto) {
        return this.driverService.createDriver(createDriverDto);
    }

    @Get()
    async getAllDrivers() {
        return this.driverService.getAllDrivers();
    }
}
