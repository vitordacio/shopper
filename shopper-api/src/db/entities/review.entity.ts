import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DriverEntity } from './drivers.entity';

@Entity('reviews')
export class ReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  id_review: string;

  @Column()
  rating: number;

  @Column()
  comment: string;

  @Column()
  driver_id: string;

  @OneToOne(() => DriverEntity, (driver) => driver.review, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
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
