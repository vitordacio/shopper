import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RideService } from './ride.service';
import { EstimateRideDto } from './dto/estimate.dto';
import { ConfirmRideDto } from './dto/confirm.dto';

@Controller('ride')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @HttpCode(HttpStatus.OK)
  @Post('estimate')
  async estimate(@Body() body: EstimateRideDto) {
    return await this.rideService.estimate(body);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('confirm')
  async confirm(@Body() body: ConfirmRideDto) {
    return await this.rideService.confirm(body);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:customer_id')
  async findByCustomerIdAndDriverId(
    @Param('customer_id') customer_id: string,
    @Query('driver_id', new ParseIntPipe({ optional: true }))
    driver_id?: number,
  ) {
    return await this.rideService.findByCustomerIdAndDriverId(
      customer_id,
      driver_id,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('drivers/all')
  async findAllDrivers() {
    return await this.rideService.findAllDrivers();
  }
}
