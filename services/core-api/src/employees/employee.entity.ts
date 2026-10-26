import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmployeeStatus } from './enums/employee-status.enum';
import { EstateAssignment } from 'src/assignments/entities/estate-assignment.entity';
import { WorkerAssignment } from 'src/assignments/entities/worker-assignment.entity';
import { EmployeePaymentDetail } from 'src/payment-details/payment-details.entity';
import { Owner } from 'src/owners/owner.entity';

@Entity({ name: 'employee' })
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Owner, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'owner_id' })
  owner?: Owner | null;

  @Column({ name: 'employee_code', type: 'varchar', length: 50, unique: true })
  employeeCode!: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName!: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: true })
  lastName?: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  nic!: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth?: Date;

  get dob(): Date | undefined {
    return this.dateOfBirth;
  }

  set dob(val: Date | undefined) {
    this.dateOfBirth = val;
  }

  @Column({
    name: 'date_joined',
    type: 'date',
    nullable: true,
    default: () => 'CURRENT_DATE',
  })
  dateJoined?: Date;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
    default: 'worker',
  })
  role?: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    default: EmployeeStatus.ACTIVE,
  })
  status!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @OneToMany(() => EstateAssignment, (assignment) => assignment.employee)
  estateAssignments!: EstateAssignment[];

  @OneToMany(() => WorkerAssignment, (assignment) => assignment.worker)
  workerAssignments!: WorkerAssignment[];

  @OneToMany(() => WorkerAssignment, (assignment) => assignment.supervisor)
  supervisorAssignments!: WorkerAssignment[];

  @OneToOne(
    () => EmployeePaymentDetail,
    (paymentDetail) => paymentDetail.employee,
  )
  paymentDetail?: EmployeePaymentDetail;
}
