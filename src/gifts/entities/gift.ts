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
import { SHIPPING_STATUS } from '../../constants';

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

  @Column('decimal', { default: 0 })
  @ApiProperty({ example: 0 })
  progress: number;

  @Column()
  @Column({ default: false })
  active: boolean;

  @Column()
  @Column({ default: false })
  successful: boolean;

  @Column({ nullable: true })
  @ApiProperty({ example: '2025-01-07T21:42:46.121Z' })
  endDate: Date;

  @Column({ nullable: true })
  @ApiProperty({ example: 'Image URL' })
  image: string;

  // Shipping attributes
  @Column({ type: 'enum', enum: SHIPPING_STATUS, default: SHIPPING_STATUS.NOT_SHIPPED })
  @ApiProperty({ example: SHIPPING_STATUS.NOT_SHIPPED, enum: SHIPPING_STATUS })
  shippingStatus: SHIPPING_STATUS;

  @Column({ nullable: true })
  @ApiProperty({ example: 'TRK123456789' })
  trackingNumber: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'FedEx' })
  shippingCarrier: string;

  @Column({ nullable: true })
  @ApiProperty({ example: '2025-01-07T21:42:46.121Z' })
  shippedAt: Date;

  @Column({ nullable: true })
  @ApiProperty({ example: '2025-01-10T21:42:46.121Z' })
  deliveredAt: Date;

  @Column({ nullable: true })
  @ApiProperty({ example: '123 Main St, City, State 12345' })
  shippingAddress: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'Package was left at front door' })
  deliveryNotes: string;

  @ManyToOne(() => User, (user) => user.gifts, { onDelete: 'RESTRICT' })
  user: User;

  @CreateDateColumn()
  @ApiProperty({ example: '2025-01-07T21:42:46.121Z' })
  createdAt: Date;

  @OneToMany(() => GiftsPayment, (giftsPayment) => giftsPayment.gift)
  giftsPayments: GiftsPayment[];
}
