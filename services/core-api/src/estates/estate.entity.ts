import { Owner } from 'src/owners/owner.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EstateStatus } from './enums/estate-status.enum';

@Entity({ name: 'estates' })
export class Estate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'owner_id' })
  ownerId!: string;

  @Column({ name: 'crop_id' })
  cropId!: string;

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
}
