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
import { GiftsPayment } from '../../gifts-payments/entities/gifts-payment';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  userName: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  birthday: Date;

  @Column()
  lastSeen: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => FriendInvitation, (invitation) => invitation.sender)
  sentInvitations: FriendInvitation[];

  @OneToMany(() => FriendInvitation, (invitation) => invitation.receiver)
  receivedInvitations: FriendInvitation[];

  @OneToMany(() => Friend, (friend) => friend.user)
  friends: Friend[];

  @OneToMany(() => Gift, (gift) => gift.user)
  gifts: Gift[];

  @OneToMany(() => GiftsPayment, (payment) => payment.user)
  giftPayments: GiftsPayment[];
}
