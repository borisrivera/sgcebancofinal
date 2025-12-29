import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuenta } from '../cuentas/cuenta.entity';
import { Movimiento, TipoMovimientoEnum } from './movimiento.entity';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';

@Injectable()
export class MovimientosService {
  constructor(
    @InjectRepository(Movimiento)
    private readonly movRepo: Repository<Movimiento>,
    @InjectRepository(Cuenta)
    private readonly cuentaRepo: Repository<Cuenta>,
  ) {}

  async listByCuenta(cuentaId: number) {
    const cuenta = await this.cuentaRepo.findOne({ where: { id: cuentaId } });
    if (!cuenta) {
      throw new NotFoundException('Cuenta no encontrada');
    }

    return this.movRepo.find({
      where: { cuenta_id: cuentaId },
      order: { id: 'DESC' },
    });
  }

  async createForCuenta(cuentaId: number, dto: CreateMovimientoDto) {
    const cuenta = await this.cuentaRepo.findOne({ where: { id: cuentaId } });
    if (!cuenta) {
      throw new NotFoundException('Cuenta no encontrada');
    }

    const monto = Number(dto.monto);
    const saldoActual = Number(cuenta.saldo ?? 0);

    if (dto.tipo === TipoMovimientoEnum.RETIRO && saldoActual < monto) {
      throw new BadRequestException('Saldo insuficiente');
    }

    const movimiento = this.movRepo.create({
      tipo: dto.tipo,
      monto,
      descripcion: dto.descripcion ?? null,
      cuenta,
      cuenta_id: cuentaId,
    });

    await this.movRepo.save(movimiento);

    cuenta.saldo =
      dto.tipo === TipoMovimientoEnum.DEPOSITO
        ? saldoActual + monto
        : saldoActual - monto;

    await this.cuentaRepo.save(cuenta);

    return movimiento;
  }
}
