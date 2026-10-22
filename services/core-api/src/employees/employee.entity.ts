import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmployeeStatus } from './enums/employee-status.enum';
import { EstateAssignment } from 'src/assignments/entities/estate-assignment.entity';
import { WorkerAssignment } from 'src/assignments/entities/worker-assignment.entity';

@Entity({ name: 'employees' })
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'employee_code', unique: true })
  employeeCode!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name', nullable: true })
  lastName?: string;

  @Column({ unique: true })
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
  status!: EmployeeStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => EstateAssignment, (assignment) => assignment.employee)
  estateAssignments!: EstateAssignment[];

  @OneToMany(() => WorkerAssignment, (assignment) => assignment.worker)
  workerAssignments!: WorkerAssignment[];

  @OneToMany(() => WorkerAssignment, (assignment) => assignment.supervisor)
  supervisorAssignments!: WorkerAssignment[];
}
