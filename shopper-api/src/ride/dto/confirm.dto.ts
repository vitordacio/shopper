import { Type } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsNumberString,
  IsNumber,
  IsNotEmpty,
  Min,
  ValidateNested,
} from 'class-validator';

class ConfirmDriverDto {
  @IsNumberString(
    {},
    { message: 'O ID do motorista deve ser um número válido' },
  )
  id: number;

  @IsString()
  @IsNotEmpty({ message: 'O nome do motorista não pode estar vazio.' })
  @MaxLength(50, {
    message: 'O nome do motorista deve ter no máximo 50 caracteres.',
  })
  name: string;
}

export class ConfirmRideDto {
  @IsString({ message: 'O ID do cliente deve ser um texto válido' })
  customer_id: string;

  @IsString()
  @IsNotEmpty({ message: 'A origem é obrigatória.' })
  @MaxLength(256, { message: 'A origem deve ter no máximo 256 caracteres.' })
  origin: string;

  @IsString()
  @IsNotEmpty({ message: 'O destino é obrigatório.' })
  @MaxLength(256, { message: 'O destino deve ter no máximo 256 caracteres.' })
  destination: string;

  @IsNumber({}, { message: 'A distância deve ser um número.' })
  @Min(0, { message: 'A distância não pode ser negativa.' })
  distance: number;

  @IsString()
  @IsNotEmpty({ message: 'A duração é obrigatória.' })
  @MaxLength(50, { message: 'A duração deve ter no máximo 50 caracteres.' })
  duration: string;

  @ValidateNested()
  @Type(() => ConfirmDriverDto)
  driver: ConfirmDriverDto;

  @IsNumber({}, { message: 'O valor deve ser um número.' })
  @Min(0, { message: 'O valor deve ser maior ou igual a 0.' })
  value: number;
}
