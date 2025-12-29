import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';

export class CreateCuentaDto {
  @ApiProperty({ example: 'caja ahorro' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 60)
  tipo_producto: string;

  @ApiProperty({ example: 'LPZ-000001' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 60)
  numero_cuenta: string;

  @ApiProperty({ example: 'BOB', enum: ['BOB', 'USD'] })
  @IsString()
  @IsIn(['BOB', 'USD'])
  moneda: string;

  @ApiProperty({ example: '1000.50', description: 'Puede ser string numérico' })
  @IsNumberString()
  monto: string;

  @ApiProperty({ example: 'La Paz' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 80)
  sucursal: string;
}
