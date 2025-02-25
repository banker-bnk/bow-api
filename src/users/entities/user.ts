import {
  Entity,
  Column,
  CreateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FriendInvitation } from '../../friend-invitations/entities/friend-invitation';
import { Friend } from '../../friends/entities/friend';
import { Gift } from '../../gifts/entities/gift';
import { Notification } from '../../notifications/entities/notification';
import { GiftsPayment } from '../../gifts-payments/entities/gifts-payment';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  userId: string; // Storing user.sub attribute from Auth0

  @Column()
  @ApiProperty()
  userName: string;

  @Column({ nullable: true })
  @ApiProperty()
  firstName: string;

  @Column({ nullable: true })
  @ApiProperty()
  lastName: string;

  @Column({ nullable: true })
  @ApiProperty()
  email: string;

  @Column({ nullable: true })
  @ApiProperty()
  phone: string;

  @Column({ nullable: true })
  @ApiProperty()
  address: string;

  @Column({ nullable: true })
  @ApiProperty()
  image: string;

  @Column({ nullable: true })
  @ApiProperty()
  birthday: Date;

  @Column()
  @ApiProperty()
  lastSeen: Date;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @OneToMany(() => FriendInvitation, (invitation) => invitation.sender)
  @ApiProperty()
  sentInvitations: FriendInvitation[];

  @OneToMany(() => FriendInvitation, (invitation) => invitation.receiver)
  @ApiProperty()
  receivedInvitations: FriendInvitation[];

  @OneToMany(() => Friend, (friend) => friend.user)
  @ApiProperty()
  friends: Friend[];

  @OneToMany(() => Gift, (gift) => gift.user)
  @ApiProperty()
  gifts: Gift[];

  @OneToMany(() => GiftsPayment, (payment) => payment.user)
  @ApiProperty()
  giftPayments: GiftsPayment[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
