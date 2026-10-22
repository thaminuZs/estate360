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

@Entity({ name: 'estates' })
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

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  code!: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location!: {
    type: 'Point';
    coordinates: [number, number];
  };

  @Column({
    type: 'geography',
    spatialFeatureType: 'Polygon',
    srid: 4326,
  })
  boundary!: {
    type: 'Polygon';
    coordinates: number[][][];
  };

  @Column({ type: 'enum', enum: EstateStatus, default: EstateStatus.ACTIVE })
  status!: EstateStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => EstateAssignment, (assignment) => assignment.estate)
  estateAssignments!: EstateAssignment[];

  @OneToMany(() => WorkerAssignment, (assignment) => assignment.estate)
  Assignments!: WorkerAssignment[];
}
