import { Device } from './device.entity';
import { Employee } from 'src/employees/employee.entity';
import { Estate } from 'src/estates/estate.entity';
import { WorkSession } from 'src/work-sessions/work-session.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'worker_iot_reading' })
export class WorkerIotReading {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @ManyToOne(() => Device, { nullable: false, eager: true })
  @JoinColumn({ name: 'device_id' })
  device!: Device;

  @ManyToOne(() => Employee, { nullable: false, eager: true })
  @JoinColumn({ name: 'worker_id' })
  worker!: Employee;

  @ManyToOne(() => Estate, { nullable: false, eager: true })
  @JoinColumn({ name: 'estate_id' })
  estate!: Estate;

  @ManyToOne(() => WorkSession, { nullable: true, eager: true })
  @JoinColumn({ name: 'work_session_id' })
  workSession?: WorkSession | null;

  @Column({ name: 'recorded_at', type: 'timestamp', nullable: true })
  recordedAt?: Date;

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

  @Column({
    name: 'activity_status',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  activityStatus?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;
}
