import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Driver } from 'src/driver/entity/driver.entity';
import { FareType } from 'src/config/enums/fare.enum';

@Entity({ name: 'rides' })
export class Ride {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Driver, (driver) => driver.rides, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver!: Driver;

  @Column({
    type: 'enum',
    enum: FareType,
  })
  fareType!: FareType;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  baseRate!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  perMileRate!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourlyRate!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  distance!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hours!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalAmount!: number;

  @Column({ type: 'timestamp', nullable: true })
  startedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
