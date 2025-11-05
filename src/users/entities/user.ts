import {
  Entity,
  Column,
  CreateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
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
  @Unique(['userId'])
  userId: string; // Storing user.sub attribute from Auth0

  @Column()
  @ApiProperty()
  @Unique(['userName'])
  userName: string;

  @Column({ nullable: true })
  @ApiProperty()
  firstName: string;

  @Column({ nullable: true })
  @ApiProperty()
  lastName: string;

  @Column({ nullable: true })
  @ApiProperty()
  @Unique(['email'])
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

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  birthday: string; // Stores only the date part (YYYY-MM-DD)

  @Column({ nullable: true })
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

  @Column({ nullable: true, default: false })
  @ApiProperty()
  onboardingCompleted: boolean;

  @Column({ nullable: true, default: true })
  @ApiProperty()
  allowAgeDisplay: boolean;

  @Column({ nullable: true, default: false })
  @ApiProperty()
  birthdayUpdatesLocked: boolean;
}
