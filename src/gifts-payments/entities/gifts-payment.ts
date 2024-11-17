import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('gifts_payments')
export class GiftsPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gift_id: number;

  @Column()
  user_id: string;

  @Column('decimal')
  amount: number;

  @Column()
  currency: string;

  @CreateDateColumn()
  createdAt: Date;
}
