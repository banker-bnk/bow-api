import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user';
import { Gift } from '../../gifts/entities/gift';
import { TBowPaymentType, PAYMENT_STATUS } from '../../constants';

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
  status: () => PAYMENT_STATUS;

  @Column({ nullable: true })
  external_id: string

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'decimal', nullable: true })
  payment_fee: number;

  @Column({ type: 'decimal', nullable: true })
  net_payment: number;

  @Column({ nullable: true })
  bow_payment_type: TBowPaymentType;
}
