import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Cliente, GeneroEnum } from './cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cuenta } from '../cuentas/cuenta.entity';
import { CreateCuentaDto } from '../cuentas/dto/create-cuenta.dto';
import { UpdateCuentaDto } from '../cuentas/dto/update-cuenta.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,
    @InjectRepository(Cuenta)
    private readonly cuentaRepo: Repository<Cuenta>,
  ) {}

  async create(dto: CreateClienteDto) {
    const exists = await this.clienteRepo.findOne({
      where: { documento_identidad: dto.documento_identidad },
      withDeleted: true,
    });

    if (exists && !exists.deletedAt) {
      throw new BadRequestException('documento_identidad ya existe');
    }

    const cliente = this.clienteRepo.create({
      nombre: dto.nombre,
      paterno: dto.paterno,
      materno: dto.materno,
      tipo_documento: dto.tipo_documento,
      documento_identidad: dto.documento_identidad,
      fecha_nacimiento: dto.fecha_nacimiento,
      genero: dto.genero as GeneroEnum,
    });

    return this.clienteRepo.save(cliente);
  }

  async findAll() {
    return this.clienteRepo.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const cliente = await this.clienteRepo.findOne({
      where: { id },
      relations: { cuentas: true },
    });

    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return cliente;
  }

  async update(id: number, dto: UpdateClienteDto) {
    const cliente = await this.clienteRepo.findOne({
      where: { id },
    });

    if (!cliente) throw new NotFoundException('Cliente no encontrado');

    if (
      dto.documento_identidad &&
      dto.documento_identidad.trim() !== '' &&
      dto.documento_identidad !== cliente.documento_identidad
    ) {
      const existsDoc = await this.clienteRepo.findOne({
        where: {
          documento_identidad: dto.documento_identidad,
          id: Not(id),
        },
        withDeleted: true,
      });

      if (existsDoc && !existsDoc.deletedAt) {
        throw new BadRequestException('documento_identidad ya existe');
      }
    }

    const patch: Partial<Cliente> = {};

    if (dto.nombre !== undefined) patch.nombre = dto.nombre;
    if (dto.paterno !== undefined) patch.paterno = dto.paterno;
    if (dto.materno !== undefined) patch.materno = dto.materno;
    if (dto.tipo_documento !== undefined)
      patch.tipo_documento = dto.tipo_documento;
    if (dto.documento_identidad !== undefined)
      patch.documento_identidad = dto.documento_identidad;
    if (dto.fecha_nacimiento !== undefined)
      patch.fecha_nacimiento = dto.fecha_nacimiento;

    if (dto.genero !== undefined) {
      patch.genero = dto.genero as GeneroEnum;
    }

    Object.assign(cliente, patch);
    return this.clienteRepo.save(cliente);
  }

  async remove(id: number) {
    const cliente = await this.clienteRepo.findOne({
      where: { id },
    });

    if (!cliente) throw new NotFoundException('Cliente no encontrado');

    await this.clienteRepo.softDelete(id);
    return { ok: true };
  }

  async fixGeneros() {
    await this.clienteRepo.query(`
      UPDATE clientes
      SET genero = 'M'
      WHERE UPPER(TRIM(genero::text)) IN ('METRO', 'MASCULINO', 'MALE', 'M')
    `);

    await this.clienteRepo.query(`
      UPDATE clientes
      SET genero = 'F'
      WHERE UPPER(TRIM(genero::text)) IN ('FEMENINO', 'FEMALE', 'F')
    `);

    await this.clienteRepo.query(`
      UPDATE clientes
      SET genero = 'Otro'
      WHERE UPPER(TRIM(genero::text)) IN ('OTRO', 'OTHER')
    `);

    return { ok: true };
  }

  // ---------- CUENTAS ----------
  async createCuenta(clienteId: number, dto: CreateCuentaDto) {
    const cliente = await this.clienteRepo.findOne({
      where: { id: clienteId },
    });

    if (!cliente) throw new NotFoundException('Cliente no encontrado');

    const exists = await this.cuentaRepo.findOne({
      where: { numero_cuenta: dto.numero_cuenta },
    });

    if (exists) throw new BadRequestException('numero_cuenta ya existe');

    const cuenta = this.cuentaRepo.create({
      ...dto,
      cliente,
      cliente_id: clienteId,
    });

    return this.cuentaRepo.save(cuenta);
  }

  async listCuentas(clienteId: number) {
    const cliente = await this.clienteRepo.findOne({
      where: { id: clienteId },
    });

    if (!cliente) throw new NotFoundException('Cliente no encontrado');

    return this.cuentaRepo.find({
      where: { cliente_id: clienteId },
      order: { id: 'DESC' },
    });
  }

  async updateCuenta(cuentaId: number, dto: UpdateCuentaDto) {
    const cuenta = await this.cuentaRepo.findOne({
      where: { id: cuentaId },
    });

    if (!cuenta) throw new NotFoundException('Cuenta no encontrada');

    Object.assign(cuenta, dto);
    return this.cuentaRepo.save(cuenta);
  }

  async deleteCuenta(cuentaId: number) {
    const cuenta = await this.cuentaRepo.findOne({
      where: { id: cuentaId },
    });

    if (!cuenta) throw new NotFoundException('Cuenta no encontrada');

    await this.cuentaRepo.delete(cuentaId);
    return { ok: true };
  }
}
