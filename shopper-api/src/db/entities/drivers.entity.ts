import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReviewEntity } from './review.entity';
import { RideEntity } from './rides.entity';

@Entity('drivers')
export class DriverEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  vehicle: string;

  @Column({ type: 'float' })
  value: number;

  @Column({ default: 0 })
  min_distance: number;

  @OneToOne(() => ReviewEntity, (review) => review.driver, {
    cascade: true,
    nullable: true,
  })
  review: ReviewEntity;

  @OneToMany(() => RideEntity, (ride) => ride.driver, {
    cascade: true,
  })
  rides: RideEntity[];

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @Exclude()
  @DeleteDateColumn()
  deleted_at: string;
}
