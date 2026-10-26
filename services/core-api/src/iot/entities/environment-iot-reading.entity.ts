import { Device } from './device.entity';
import { Estate } from 'src/estates/estate.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'environment_iot_reading' })
export class EnvironmentIotReading {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @ManyToOne(() => Device, { nullable: false, eager: true })
  @JoinColumn({ name: 'device_id' })
  device!: Device;

  @ManyToOne(() => Estate, { nullable: false, eager: true })
  @JoinColumn({ name: 'estate_id' })
  estate!: Estate;

  @Column({ name: 'recorded_at', type: 'timestamp' })
  recordedAt!: Date;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  temperature?: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  humidity?: number;

  @Column({
    name: 'soil_moisture',
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  soilMoisture?: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;
}
