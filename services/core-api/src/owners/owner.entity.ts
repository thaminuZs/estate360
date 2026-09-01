import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'owners' })
export class Owner {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ name: 'contact_email' })
  contactEmail!: string;

  @Column()
  phone!: string;

  @Column()
  address!: string;
}
