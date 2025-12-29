import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cuenta } from './cuenta.entity';
import { CuentasController } from './cuentas.controller';
import { CuentasService } from './cuentas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cuenta])],
  controllers: [CuentasController],
  providers: [CuentasService],
})
export class CuentasModule {}
