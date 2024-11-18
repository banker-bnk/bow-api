import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user';
import { Gift } from '../../gifts/entities/gift';

@Entity('gifts_payments')
export class GiftsPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Gift, { onDelete: 'RESTRICT' })
  gift: Gift;

  @ManyToOne(() => User, (user) => user.giftPayments, { onDelete: 'RESTRICT' })
  user: User;

  @Column('decimal')
  amount: number;

  @Column()
  currency: string;

  @Column()
  source: string;

  @CreateDateColumn()
  createdAt: Date;
}
