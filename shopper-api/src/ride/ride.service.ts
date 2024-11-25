import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstimateRideDto } from './dto/estimate.dto';
import axiosInstace from '../config/axios';
import { DriverService } from '../driver/driver.service';
import { RideOptionsService } from '../ride_options/ride_options.service';
import { RideOptionEntity } from '../db/entities/ride_options.entity';
import { ConfirmRideDto } from './dto/confirm.dto';
import { RideDto } from './dto/ride.dto';
import { RideEntity } from '../db/entities/rides.entity';

@Injectable()
export class RideService {
  private googleMapsApiKey: string;

  constructor(
    @InjectRepository(RideEntity)
    private readonly rideRepositoty: Repository<RideEntity>,
    private readonly configService: ConfigService,
    private readonly driverService: DriverService,
    private readonly rideOptionsService: RideOptionsService,
  ) {
    this.googleMapsApiKey = this.configService.get<string>('GOOGLE_API_KEY');
  }

  create(data: RideDto) {
    const driver = this.rideRepositoty.create({
      customer_id: data.customer_id,
      origin: data.origin,
      destination: data.destination,
      distance: data.distance,
      duration: data.duration,
      value: data.value,
      driver_id: data.driver_id,
    });

    return driver;
  }

  async save(entitie: RideEntity): Promise<RideEntity> {
    const ride = await this.rideRepositoty.save(entitie);

    return ride;
  }

  ridesToDto(rides: RideEntity[]) {
    return rides.map((ride) => ({
      id: ride.id_ride,
      date: ride.created_at,
      origin: ride.origin,
      destination: ride.destination,
      distance: ride.distance,
      duration: ride.duration,
      driver: {
        id: ride.driver.id,
        name: ride.driver.name,
      },
      value: ride.value,
    }));
  }

  verifyOriginDestination(origin: string, destination: string) {
    if (origin.toLowerCase() === destination.toLowerCase()) {
      throw new HttpException(
        {
          error_description: 'A origem e o destino não podem ser iguais',
          error_code: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllDrivers() {
    const drivers = await this.driverService.findAll();
    return this.driverService.formateToDto(drivers);
  }

  async estimate(body: EstimateRideDto) {
    let ride_option: RideOptionEntity;
    const { origin, destination } = body;

    this.verifyOriginDestination(origin, destination);

    ride_option = await this.rideOptionsService.findByOriginAndDestination(
      origin,
      destination,
    );

    if (!ride_option) {
      try {
        const response = await axiosInstace.get('', {
          params: {
            origin,
            destination,
            key: this.googleMapsApiKey,
          },
        });

        if (response.data.status === 'OK') {
          const { end_location, start_location, distance, duration } =
            response.data.routes[0].legs[0];

          ride_option = this.rideOptionsService.create({
            distance: distance.value,
            duration: duration.text,
            origin_name: origin,
            origin_lat: start_location.lat,
            origin_lng: start_location.lng,
            destination_name: destination,
            destination_lat: end_location.lat,
            destination_lng: end_location.lng,
          });
          await this.rideOptionsService.save(ride_option);
        } else {
          throw new HttpException(
            {
              error_code: 'INVALID_DATA',
              error_description:
                'Os dados fornecidos no corpo da requisição são inválidos',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      } catch (error) {
        throw new HttpException(
          {
            error_code: HttpStatus.INTERNAL_SERVER_ERROR,
            error_description: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    const drivers = await this.driverService.findAll();
    const rideDrives = drivers.filter(
      (driver) => driver.min_distance <= ride_option.distance / 1000,
    );

    return {
      origin: {
        latitude: ride_option.origin_lat,
        longitude: ride_option.origin_lng,
      },
      destination: {
        latitude: ride_option.destination_lat,
        longitude: ride_option.destination_lng,
      },
      distance: ride_option.distance,
      duration: ride_option.duration,
      options: this.driverService.formateToDto(rideDrives),
      routeResponse: {
        success: true,
      },
    };
  }

  async confirm(body: ConfirmRideDto) {
    const {
      customer_id,
      origin,
      destination,
      distance,
      duration,
      driver,
      value,
    } = body;

    this.verifyOriginDestination(origin, destination);

    const [foundRideOption, foundDriver] = await Promise.all([
      this.rideOptionsService.findByOriginAndDestination(origin, destination),
      this.driverService.findById(driver.id.toString()),
    ]);

    if (!foundRideOption) {
      throw new HttpException(
        {
          error_code: 'RIDE_NOT_FOUND',
          error_description: 'Corrida não encontrada',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!foundDriver || foundDriver.name !== driver.name) {
      throw new HttpException(
        {
          error_code: 'DRIVER_NOT_FOUND',
          error_description: 'Motorista não encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (distance < foundDriver.min_distance) {
      throw new HttpException(
        {
          error_code: 'INVALID_DISTANCE',
          error_description: 'Quilometragem inválida para o motorista',
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    if (
      distance !== foundRideOption.distance ||
      duration !== foundRideOption.duration ||
      value < foundDriver.value
    ) {
      throw new HttpException(
        {
          error_code: 'INVALID_DATA',
          error_description:
            'Os dados fornecidos no corpo da requisição são inválidos',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const ride = this.create({
      customer_id,
      destination,
      duration,
      distance,
      origin,
      value,
      driver_id: foundDriver.id,
    });
    await this.save(ride);

    return {
      success: true,
    };
  }

  async findByCustomerIdAndDriverId(customer_id: string, driver_id?: number) {
    let rides: RideEntity[] = [];

    if (driver_id) {
      const driver = await this.driverService.findById(driver_id.toString());

      if (!driver) {
        throw new HttpException(
          {
            error_code: 'INVALID_DRIVER',
            error_description: 'Motorista invalido',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      rides = await this.rideRepositoty.find({
        relations: ['driver'],
        where: { customer_id, driver_id: driver_id.toString() },
        order: { created_at: 'DESC' },
      });
    } else {
      rides = await this.rideRepositoty.find({
        relations: ['driver'],
        where: { customer_id },
        order: { created_at: 'DESC' },
      });
    }

    if (rides.length === 0) {
      throw new HttpException(
        {
          error_code: 'NO_RIDES_FOUND',
          error_description: 'Nenhum registro encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      customer_id,
      rides: this.ridesToDto(rides),
    };
  }
}
