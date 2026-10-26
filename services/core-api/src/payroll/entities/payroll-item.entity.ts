import { Employee } from 'src/employees/employee.entity';
import { Estate } from 'src/estates/estate.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Payroll } from './payroll.entity';
import { Payment } from './payment.entity';

@Entity({ name: 'payroll_item' })
export class PayrollItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Payroll, (payroll) => payroll.items, {
    nullable: false,
  })
  @JoinColumn({ name: 'payroll_id' })
  payroll!: Payroll;

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

  @Column({
    name: 'basic_pay',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  basicPay!: number;

  @Column({
    name: 'production_pay',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  productionPay!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  overtime!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  allowances!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  bonuses!: number;

  @Column({
    name: 'gross_pay',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  grossPay!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  deductions!: number;

  @Column({
    name: 'net_pay',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  netPay?: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @OneToOne(() => Payment, (payment) => payment.payrollItem)
  payment?: Payment;
}
