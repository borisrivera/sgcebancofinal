import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { MovimientosService } from './movimientos.service';

@ApiTags('movimientos')
@Controller()
export class MovimientosController {
  constructor(private readonly service: MovimientosService) {}

  @Get('cuentas/:cuentaId/movimientos')
  list(@Param('cuentaId') cuentaId: string) {
    return this.service.listByCuenta(Number(cuentaId));
  }

  @Post('cuentas/:cuentaId/movimientos')
  create(
    @Param('cuentaId') cuentaId: string,
    @Body() dto: CreateMovimientoDto,
  ) {
    return this.service.createForCuenta(Number(cuentaId), dto);
  }
}
