import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { DriverModule } from '../driver/driver.module';
import { RideOptionsModule } from '../ride_options/ride_options.module';
import { RideEntity } from '../db/entities/rides.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RideEntity]),
    ConfigModule,
    DriverModule,
    RideOptionsModule,
  ],
  controllers: [RideController],
  providers: [RideService],
})
export class RideModule {}
