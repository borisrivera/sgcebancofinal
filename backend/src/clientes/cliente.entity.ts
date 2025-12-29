import { Cuenta } from '../cuentas/cuenta.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum GeneroEnum {
  M = 'M',
  F = 'F',
  Otro = 'Otro',
}

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  nombre: string;

  @Column({ length: 120 })
  paterno: string;

  @Column({ length: 120 })
  materno: string;

  @Column({ length: 30 })
  tipo_documento: string;

  @Column({ length: 40, unique: true })
  documento_identidad: string;

  @Column({ type: 'date' })
  fecha_nacimiento: string; // YYYY-MM-DD

  // ✅ Solo permitirá M | F | Otro
  @Column({ type: 'enum', enum: GeneroEnum, default: GeneroEnum.M })
  genero: GeneroEnum;

  @CreateDateColumn()
  fecha_creacion: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;

  @OneToMany(() => Cuenta, (cuenta) => cuenta.cliente)
  cuentas: Cuenta[];
}
