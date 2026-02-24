import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { RidesService } from './rides.service';
import { CreateRideDto } from './dtos/create-ride.dto';
import { EndRideDto } from './dtos/end-ride.dto';

@Controller('rides')
export class RidesController {
    constructor(private readonly ridesService: RidesService) { }

    @Post()
    async createRide(@Body() createRideDto: CreateRideDto) {
        return this.ridesService.createRide(createRideDto);
    }

    @Patch(':id/start')
    async startRide(@Param('id', ParseIntPipe) id: number) {
        return this.ridesService.startRide(id);
    }

    @Patch(':id/end')
    async endRide(@Param('id', ParseIntPipe) id: number, @Body() endRideDto: EndRideDto) {
        return this.ridesService.endRide(id, endRideDto);
    }

    @Get()
    async findAll() {
        return this.ridesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ridesService.findOne(id);
    }
}
