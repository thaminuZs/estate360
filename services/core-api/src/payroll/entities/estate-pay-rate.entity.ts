import { Estate } from 'src/estates/estate.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'estate_pay_rate' })
export class EstatePayRate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Estate, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'estate_id' })
  estate!: Estate;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  rate!: number;

  @Column({ type: 'varchar', length: 20 })
  unit!: string;

  @Column({ name: 'payment_factor', type: 'numeric', precision: 5, scale: 2 })
  paymentFactor!: number;

  @Column({ name: 'effective_from', type: 'date' })
  effectiveFrom!: Date;

  @Column({ name: 'effective_to', type: 'date', nullable: true })
  effectiveTo?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;
}
