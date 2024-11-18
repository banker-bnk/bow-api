import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user';

@Entity('friend_invitations')
export class FriendInvitation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentInvitations, {
    onDelete: 'RESTRICT',
  })
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedInvitations, {
    onDelete: 'RESTRICT',
  })
  receiver: User;

  @Column({ default: 'PENDING' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
