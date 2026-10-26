import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EstateStatus } from './enums/estate-status.enum';
import { Crop } from 'src/crop/crop.entity';
import { Owner } from 'src/owners/owner.entity';
import { EstateAssignment } from 'src/assignments/entities/estate-assignment.entity';
import { WorkerAssignment } from 'src/assignments/entities/worker-assignment.entity';

@Entity({ name: 'estate' })
export class Estate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Owner, (owner) => owner.estates, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'owner_id' })
  owner!: Owner;

  @ManyToOne(() => Crop, (crop) => crop.estates, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'crop_id' })
  crop!: Crop;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code!: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Polygon',
    srid: 4326,
    nullable: true,
  })
  boundary?: {
    type: 'Polygon';
    coordinates: number[][][];
  };

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    default: EstateStatus.ACTIVE,
  })
  status!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @OneToMany(() => EstateAssignment, (assignment) => assignment.estate)
  estateAssignments!: EstateAssignment[];

  @OneToMany(() => WorkerAssignment, (assignment) => assignment.estate)
  workerAssignments!: WorkerAssignment[];
}
