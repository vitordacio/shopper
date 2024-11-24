import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RideModule } from './ride/ride.module';
import { DbModule } from './db/db.module';
import { DriverModule } from './driver/driver.module';
import { RideOptionsModule } from './ride_options/ride_options.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RideModule,
    DbModule,
    DriverModule,
    RideOptionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
