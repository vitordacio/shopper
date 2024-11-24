import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RideOptionsService } from './ride_options.service';
import { RideOptionEntity } from '../db/entities/ride_options.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RideOptionEntity])],
  providers: [RideOptionsService],
  exports: [RideOptionsService],
})
export class RideOptionsModule {}
