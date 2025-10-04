import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user';
import { Gift } from '../../gifts/entities/gift';
import { PAYMENT_STATUS } from '../../constants';

@Entity('gifts_payments')
export class GiftsPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Gift, { onDelete: 'RESTRICT' })
  gift: Gift;

  @ManyToOne(() => User, (user) => user.giftPayments, { onDelete: 'RESTRICT' })
  user: Partial<User>;

  @Column('decimal')
  amount: number;

  @Column()
  currency: string;

  @Column()
  source: string;

  @Column({ nullable: true })
  message: string;

  @Column({ type: 'enum', enum: PAYMENT_STATUS, nullable: true })
  status: PAYMENT_STATUS;

  @CreateDateColumn()
  createdAt: Date;
}
