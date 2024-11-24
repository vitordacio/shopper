import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverEntity } from '../db/entities/drivers.entity';
import { DriverService } from './driver.service';

@Module({
  imports: [TypeOrmModule.forFeature([DriverEntity])],
  providers: [DriverService],
  exports: [DriverService],
})
export class DriverModule {}
