import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('ride_options')
export class RideOptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id_ride_option: string;

  @Column({ type: 'float' })
  distance: number;

  @Column()
  duration: string;

  @Column()
  origin_name: string;

  @Column()
  origin_lat: string;

  @Column()
  origin_lng: string;

  @Column()
  destination_name: string;

  @Column()
  destination_lat: string;

  @Column()
  destination_lng: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @Exclude()
  @DeleteDateColumn()
  deleted_at: string;
}
