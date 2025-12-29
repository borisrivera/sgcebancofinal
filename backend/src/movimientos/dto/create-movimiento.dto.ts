import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { TipoMovimientoEnum } from '../movimiento.entity';

export class CreateMovimientoDto {
  @ApiProperty({
    enum: TipoMovimientoEnum,
    example: TipoMovimientoEnum.DEPOSITO,
  })
  @IsEnum(TipoMovimientoEnum)
  tipo: TipoMovimientoEnum;

  @ApiProperty({ example: 10.5 })
  @IsNumber()
  @IsPositive()
  monto: number;

  @ApiProperty({ example: 'Pago de algo', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  descripcion?: string;
}
