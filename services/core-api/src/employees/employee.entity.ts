import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmployeeStatus } from './enums/employee-status.enum';

@Entity({ name: 'employees' })
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'employee_code' })
  employeeCode!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name', nullable: true })
  lastName?: string;

  @Column()
  nic!: string;

  @Column()
  phone!: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  dob?: Date;

  @Column({ name: 'date_joined', nullable: true })
  dateJoined?: Date;

  @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.INACTIVE,
  })
  status?: EmployeeStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
