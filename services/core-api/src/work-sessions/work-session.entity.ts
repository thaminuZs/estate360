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

@Entity({ name: 'work_session' })
export class WorkSession {
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

  @Column({ name: 'start_time', type: 'timestamp' })
  startTime!: Date;

  @Column({ name: 'end_time', type: 'timestamp', nullable: true })
  endTime?: Date;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;
}
