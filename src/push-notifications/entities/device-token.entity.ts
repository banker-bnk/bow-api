import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user';

@Entity('device_tokens')
export class DeviceToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index({ unique: true }) // Índice para búsquedas rápidas y garantizar unicidad
  token: string;
  
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;
  
  @Column({ nullable: true })
  @Index() // Índice para búsquedas rápidas por userId
  userId: number;
  
  @Column({ type: 'jsonb', nullable: true, default: null })
  deviceInfo: {
    platform: string;
    model?: string;
    osVersion?: string;
    // Otros datos relevantes del dispositivo
  };
  
  @Column({ default: true })
  isActive: boolean; // Para desactivar tokens sin eliminarlos
  
  @Column({ nullable: true, default: null })
  lastUsed: Date; // Última vez que se envió una notificación a este token
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
} 