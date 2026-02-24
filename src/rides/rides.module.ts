import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RidesController } from './rides.controller';
import { RidesService } from './rides.service';
import { Ride } from './entity/rides.entity';
import { Driver } from '../driver/entity/driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ride, Driver])],
  controllers: [RidesController],
  providers: [RidesService],
  exports: [RidesService],
})
export class RidesModule { }
