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
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'employee_id' })
  worker!: Employee;

  @ManyToOne(() => Estate, (estate) => estate.estateAssignments, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'estate_id' })
  estate!: Estate;

  @ManyToOne(() => Employee, (supervisor) => supervisor.supervisorAssignments, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'supervisor_id' })
  supervisor?: Employee | null;

  @Column({ name: 'start_date' })
  startDate!: Date;

  @Column({ name: 'end_date', nullable: true })
  endDate?: Date;

  @CreateDateColumn({ name: 'created-at' })
  createdAt!: Date;
}
