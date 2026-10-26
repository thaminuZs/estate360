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

@Entity({ name: 'attendance' })
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Employee, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'worker_id' })
  worker!: Employee;

  @ManyToOne(() => Estate, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'estate_id' })
  estate!: Estate;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ name: 'check_in', type: 'timestamp' })
  checkIn!: Date;

  @Column({ name: 'check_out', type: 'timestamp', nullable: true })
  checkOut?: Date;

  @Column({ type: 'varchar', length: 20, default: 'present' })
  status!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;
}
