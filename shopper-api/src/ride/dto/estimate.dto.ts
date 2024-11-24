import { IsString, MaxLength, MinLength } from 'class-validator';

export class EstimateRideDto {
  @IsString({ message: 'O ID do cliente deve ser um número válido' })
  customer_id: string;

  @IsString()
  @MinLength(3, { message: 'A origem deve ter no mínimo 3 caracteres' })
  @MaxLength(256, { message: 'A origem deve ter no máximo 256 caracteres' })
  origin: string;

  @IsString()
  @MinLength(3, { message: 'O destino deve ter no mínimo 3 caracteres' })
  @MaxLength(256, { message: 'O destino deve ter no máximo 256 caracteres' })
  destination: string;
}
