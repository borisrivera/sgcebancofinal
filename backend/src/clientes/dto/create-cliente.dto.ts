import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateClienteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 120)
  nombre: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 120)
  paterno: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 120)
  materno: string;

  @ApiProperty({ example: 'CI' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  tipo_documento: string;

  @ApiProperty({ example: '1234567' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 40)
  documento_identidad: string;

  @ApiProperty({ example: '2000-01-15' })
  @IsDateString()
  fecha_nacimiento: string;

  @ApiProperty({ example: 'M', enum: ['M', 'F', 'Otro'] })
  @IsString()
  @IsIn(['M', 'F', 'Otro'])
  genero: string;
}
