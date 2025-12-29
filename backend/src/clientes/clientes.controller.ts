import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { CreateCuentaDto } from '../cuentas/dto/create-cuenta.dto';
import { UpdateCuentaDto } from '../cuentas/dto/update-cuenta.dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly service: ClientesService) {}

  // ---------- CLIENTES ----------
  @Post()
  create(@Body() dto: CreateClienteDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('fix-generos')
  fixGeneros() {
    return this.service.fixGeneros();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClienteDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // ---------- CUENTAS POR CLIENTE ----------
  @Post(':clienteId/cuentas')
  createCuenta(
    @Param('clienteId', ParseIntPipe) clienteId: number,
    @Body() dto: CreateCuentaDto,
  ) {
    return this.service.createCuenta(clienteId, dto);
  }

  @Get(':clienteId/cuentas')
  listCuentas(@Param('clienteId', ParseIntPipe) clienteId: number) {
    return this.service.listCuentas(clienteId);
  }

  @Put('cuentas/:cuentaId')
  updateCuenta(
    @Param('cuentaId', ParseIntPipe) cuentaId: number,
    @Body() dto: UpdateCuentaDto,
  ) {
    return this.service.updateCuenta(cuentaId, dto);
  }

  @Delete('cuentas/:cuentaId')
  deleteCuenta(@Param('cuentaId', ParseIntPipe) cuentaId: number) {
    return this.service.deleteCuenta(cuentaId);
  }
}
