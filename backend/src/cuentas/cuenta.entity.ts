import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cliente } from '../clientes/cliente.entity';
import { Movimiento } from '../movimientos/movimiento.entity';

export enum TipoCuentaEnum {
  AHORRO = 'AHORRO',
  CORRIENTE = 'CORRIENTE',
}

@Entity('cuentas')
export class Cuenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40, unique: true })
  numero_cuenta: string;

  @Column({ type: 'enum', enum: TipoCuentaEnum })
  tipo: TipoCuentaEnum;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
  })
  saldo: number;

  @Column({ length: 10, default: 'BOB' })
  moneda: string;

  /* =========================
     🔗 Relación con Cliente
     ========================= */
  @Column()
  cliente_id: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.cuentas, {
    onDelete: 'CASCADE',
  })
  cliente: Cliente;

  /* =========================
     🔗 Relación con Movimientos
     ========================= */
  @OneToMany(() => Movimiento, (movimiento) => movimiento.cuenta)
  movimientos: Movimiento[];

  /* =========================
     🕒 Auditoría
     ========================= */
  @CreateDateColumn()
  createdAt: Date;
}
