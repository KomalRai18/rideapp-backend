import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class EndRideDto {
    @IsNumber()
    @IsOptional()
    @IsPositive()
    distance?: number;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    hours?: number;
}
