import { Employee } from 'src/employees/employee.entity';
import { Estate } from 'src/estates/estate.entity';
import { WorkSession } from 'src/work-sessions/work-session.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'production_record' })
export class ProductionRecord {
  @PrimaryGeneratedColumn({ type: 'bigint' })
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

  @ManyToOne(() => WorkSession, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'work_session_id' })
  workSession!: WorkSession;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  quantity!: number;

  @Column({ type: 'varchar', length: 20 })
  unit!: string;

  @Column({ name: 'recorded_at', type: 'timestamp', nullable: true })
  recordedAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;
}
