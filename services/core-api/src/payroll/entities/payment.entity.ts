import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PayrollItem } from './payroll-item.entity';

@Entity({ name: 'payment' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => PayrollItem, (item) => item.payment, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'payroll_item_id' })
  payrollItem!: PayrollItem;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount!: number;

  @Column({ name: 'payment_date', type: 'timestamp' })
  paymentDate!: Date;

  @Column({ name: 'bank_name', type: 'varchar', length: 150 })
  bankName!: string;

  @Column({ name: 'account_number', type: 'varchar', length: 50 })
  accountNumber!: string;

  @Column({ name: 'account_name', type: 'varchar', length: 150 })
  accountName!: string;

  @Column({
    name: 'transaction_reference',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  transactionReference?: string;

  @Column({ type: 'varchar', length: 20, default: 'completed' })
  status!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;
}
