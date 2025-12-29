import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuenta } from './cuenta.entity';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';

@Injectable()
export class CuentasService {
  constructor(
    @InjectRepository(Cuenta) private readonly cuentaRepo: Repository<Cuenta>,
  ) {}

  async findOne(id: number) {
    const cuenta = await this.cuentaRepo.findOne({ where: { id } });
    if (!cuenta) throw new NotFoundException('Cuenta no encontrada');
    return cuenta;
  }

  async update(id: number, dto: UpdateCuentaDto) {
    const cuenta = await this.cuentaRepo.findOne({ where: { id } });
    if (!cuenta) throw new NotFoundException('Cuenta no encontrada');
    Object.assign(cuenta, dto);
    return this.cuentaRepo.save(cuenta);
  }

  async remove(id: number) {
    const cuenta = await this.cuentaRepo.findOne({ where: { id } });
    if (!cuenta) throw new NotFoundException('Cuenta no encontrada');
    await this.cuentaRepo.delete(id);
    return { ok: true };
  }
}
