import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { FareType } from '../../config/enums/fare.enum';

export class CreateRideDto {
    @IsNumber()
    @IsNotEmpty()
    driverId!: number;

    @IsEnum(FareType)
    @IsNotEmpty()
    fareType!: FareType;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    baseRate?: number;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    perMileRate?: number;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    hourlyRate?: number;
}
