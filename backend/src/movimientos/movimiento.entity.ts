import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cuenta } from '../cuentas/cuenta.entity';

export enum TipoMovimientoEnum {
  DEPOSITO = 'DEPOSITO',
  RETIRO = 'RETIRO',
}

@Entity('movimientos')
export class Movimiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TipoMovimientoEnum,
  })
  tipo: TipoMovimientoEnum;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
  })
  monto: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  descripcion?: string | null;

  @Column()
  cuenta_id: number;

  @ManyToOne(() => Cuenta, (cuenta) => cuenta.movimientos, {
    onDelete: 'CASCADE',
  })
  cuenta: Cuenta;

  @CreateDateColumn()
  creado_en: Date;
}
