import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Cliente } from './clientes/cliente.entity';
import { Cuenta } from './cuentas/cuenta.entity';
import { Movimiento } from './movimientos/movimiento.entity';

import { ClientesModule } from './clientes/clientes.module';
import { CuentasModule } from './cuentas/cuentas.module';
import { MovimientosModule } from './movimientos/movimientos.module';

@Module({
  imports: [
    // 🌱 Variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 🗄️ Base de datos
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT') ?? 5432),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        entities: [Cliente, Cuenta, Movimiento],
        synchronize: true, // ✅ solo para desarrollo / prueba
      }),
    }),

    // 📦 Módulos del sistema
    ClientesModule,
    CuentasModule,
    MovimientosModule,
  ],
})
export class AppModule {}
