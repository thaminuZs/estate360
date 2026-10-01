import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EstateStatus } from './enums/estate-status.enum';
import { Crop } from 'src/crop/crop.entity';

@Entity({ name: 'estates' })
export class Estate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'owner_id' })
  owner!: string;

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
}
