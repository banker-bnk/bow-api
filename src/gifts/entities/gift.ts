import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user';
import { ApiProperty } from '@nestjs/swagger';
import { GiftsPayment } from '../../gifts-payments/entities/gifts-payment';

@Entity('gifts')
export class Gift {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column()
  @ApiProperty({ example: 'Birthday gift' })
  title: string;

  @Column()
  @ApiProperty({ example: 'Description' })
  description: string;

  @Column()
  @ApiProperty({ example: 'www.bow.com' })
  link: string;

  @Column('decimal')
  @ApiProperty({ example: 12.99 })
  price: number;

  @Column()
  @ApiProperty({ example: 'ARS' })
  currency: string;

  @Column({ nullable: true })
  @ApiProperty({ example: '2025-01-07T21:42:46.121Z' })
  endDate: Date;

  @Column({ nullable: true })
  @ApiProperty({ example: 'Image URL' })
  image: string;

  @ManyToOne(() => User, (user) => user.gifts, { onDelete: 'RESTRICT' })
  user: User;

  @CreateDateColumn()
  @ApiProperty({ example: '2025-01-07T21:42:46.121Z' })
  createdAt: Date;

  @OneToMany(() => GiftsPayment, (giftsPayment) => giftsPayment.gift)
  giftsPayments: GiftsPayment[];
}
