import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RideOptionEntity } from '../db/entities/ride_options.entity';
import { RideOptionDto } from './dto/ride_options.dto';

@Injectable()
export class RideOptionsService {
  constructor(
    @InjectRepository(RideOptionEntity)
    private readonly rideOptionsRepositoty: Repository<RideOptionEntity>,
  ) {}

  create(data: RideOptionDto): RideOptionEntity {
    const ride_option = this.rideOptionsRepositoty.create({
      distance: data.distance,
      duration: data.duration,
      origin_name: data.origin_name.toLowerCase(),
      origin_lat: data.origin_lat,
      origin_lng: data.origin_lng,
      destination_name: data.destination_name.toLowerCase(),
      destination_lat: data.destination_lat,
      destination_lng: data.destination_lng,
    });

    return ride_option;
  }

  async save(entitie: RideOptionEntity): Promise<RideOptionEntity> {
    const ride_option = await this.rideOptionsRepositoty.save(entitie);

    return ride_option;
  }

  async findByOriginAndDestination(
    origin: string,
    destination: string,
  ): Promise<RideOptionEntity> {
    const ride_option = await this.rideOptionsRepositoty.findOne({
      where: {
        origin_name: origin.toLowerCase(),
        destination_name: destination.toLowerCase(),
      },
    });

    return ride_option;
  }
}
