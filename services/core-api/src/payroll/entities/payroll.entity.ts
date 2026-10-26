import { Owner } from 'src/owners/owner.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PayrollItem } from './payroll-item.entity';

@Entity({ name: 'payroll' })
export class Payroll {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Owner, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'owner_id' })
  owner!: Owner;

  @Column({ name: 'period_start', type: 'date' })
  periodStart!: Date;

  @Column({ name: 'period_end', type: 'date' })
  periodEnd!: Date;

  @Column({ name: 'payment_frequency', type: 'varchar', length: 20 })
  paymentFrequency!: string;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'processed_at', type: 'timestamp', nullable: true })
  processedAt?: Date;

  @OneToMany(() => PayrollItem, (item) => item.payroll)
  items!: PayrollItem[];
}
