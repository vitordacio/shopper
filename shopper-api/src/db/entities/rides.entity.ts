import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DriverEntity } from './drivers.entity';

@Entity('rides')
export class RideEntity {
  @PrimaryGeneratedColumn('uuid')
  id_ride: string;

  @Column()
  customer_id: string;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column({ type: 'float' })
  distance: number;

  @Column()
  duration: string;

  @Column({ type: 'float' })
  value: number;

  @Column()
  driver_id: string;

  @ManyToOne(() => DriverEntity, (driver) => driver.rides, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @Exclude()
  @DeleteDateColumn()
  deleted_at: string;
}
