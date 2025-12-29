import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CuentasService } from './cuentas.service';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';

@ApiTags('cuentas')
@Controller('cuentas')
export class CuentasController {
  constructor(private readonly service: CuentasService) {}

  // GET /cuentas/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  // PUT /cuentas/:id
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCuentaDto) {
    return this.service.update(Number(id), dto);
  }

  // DELETE /cuentas/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
