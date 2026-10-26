import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DeviceStatus } from '../enums/device.enums';
import { DeviceAssignment } from './device-assignment.entity';

@Entity({ name: 'device' })
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'device_code', type: 'varchar', length: 255, unique: true })
  deviceCode!: string;

  @Column({ name: 'device_type', type: 'varchar', length: 50 })
  deviceType!: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: DeviceStatus.ACTIVE,
  })
  status!: string;

  @CreateDateColumn({ name: 'created_at', type: 'date' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'date' })
  updatedAt!: Date;

  @OneToMany(() => DeviceAssignment, (assignment) => assignment.device)
  assignments!: DeviceAssignment[];
}
