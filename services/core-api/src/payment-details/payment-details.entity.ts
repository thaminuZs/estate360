import { Employee } from 'src/employees/employee.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'employee_payment_detail' })
export class EmployeePaymentDetail {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Employee, (employee) => employee.paymentDetail, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @Column({ name: 'payment_frequency', type: 'varchar', length: 20 })
  paymentFrequency!: string;

  @Column({ name: 'bank_name', type: 'varchar', length: 150 })
  bankName!: string;

  @Column({ name: 'account_number', type: 'varchar', length: 50 })
  accountNumber!: string;

  @Column({ name: 'account_name', type: 'varchar', length: 150 })
  accountName!: string;

  @Column({ type: 'varchar', length: 150 })
  branch!: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
