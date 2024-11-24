import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverEntity } from '../db/entities/drivers.entity';
import { DriverDto } from './dto/driver.dto';
import DefaultDrivers from './default';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(DriverEntity)
    private readonly driverRepositoty: Repository<DriverEntity>,
  ) {}

  create(data: DriverDto): DriverEntity {
    const driver = this.driverRepositoty.create({
      name: data.name,
      description: data.description,
      vehicle: data.vehicle,
      value: data.value,
      min_distance: data.min_distance,
      review: {
        rating: data.review.rating,
        comment: data.review.comment,
      },
    });

    return driver;
  }

  formateToDto(drivers: DriverEntity[]) {
    return drivers.map((driver) => ({
      id: driver.id,
      name: driver.name,
      description: driver.description,
      vehicle: driver.vehicle,
      review: {
        rating: driver.review.rating,
        comment: driver.review.comment,
      },
      value: driver.value,
    }));
  }

  async findAll(): Promise<DriverEntity[]> {
    let drivers: DriverEntity[] = [];
    drivers = await this.driverRepositoty.find({
      relations: ['review'],
      order: { id: 'ASC' },
    });

    if (drivers.length < 3) {
      if (drivers.length)
        await this.driverRepositoty.delete(drivers.map((driver) => driver.id));

      const newDrivers = DefaultDrivers.map((driver) => this.create(driver));
      drivers = await this.driverRepositoty.save(newDrivers);
    }

    return drivers;
  }

  async findById(id: string): Promise<DriverEntity> {
    const driver = await this.driverRepositoty.findOne({
      relations: ['review'],
      where: { id },
    });

    return driver;
  }
}
