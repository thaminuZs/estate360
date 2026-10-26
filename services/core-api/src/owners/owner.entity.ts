import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OwnerStatus } from './enums/owner-status.enum';
import { Estate } from 'src/estates/estate.entity';
import { User } from 'src/auth/entities/users.entity';

@Entity({ name: 'owner' })
export class Owner {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: true,
  })
  email?: string;

  get contactEmail(): string {
    return this.email ?? '';
  }

  set contactEmail(val: string) {
    this.email = val;
  }

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    default: OwnerStatus.ACTIVE,
  })
  status!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @OneToMany(() => Estate, (estate) => estate.owner)
  estates!: Estate[];

  @OneToOne(() => User, (user) => user.owner)
  user?: User;
}
