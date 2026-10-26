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

@Entity({ name: 'worker_assignment' })
export class WorkerAssignment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Employee, (employee) => employee.workerAssignments, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'worker_id' })
  worker?: Employee;

  @ManyToOne(() => Estate, (estate) => estate.workerAssignments, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'estate_id' })
  estate?: Estate;

  @ManyToOne(() => Employee, (supervisor) => supervisor.supervisorAssignments, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'supervisor_id' })
  supervisor?: Employee | null;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate?: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;
}
