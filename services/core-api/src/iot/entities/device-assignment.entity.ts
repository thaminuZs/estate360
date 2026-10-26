import { Employee } from 'src/employees/employee.entity';
import { Estate } from 'src/estates/estate.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Device } from './device.entity';

@Entity({ name: 'device_assignment' })
export class DeviceAssignment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Device, (device) => device.assignments, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'device_id' })
  device!: Device;

  @ManyToOne(() => Employee, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'worker_id' })
  worker?: Employee | null;

  @ManyToOne(() => Estate, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'estate_id' })
  estate!: Estate;

  @Column({ name: 'start_date', type: 'date' })
  startDate!: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;
}
