import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user';
import { NotificationType } from '../enums/notification-type.enum';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  user: User; // Recipient of the notification

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  actor: User; // The user who triggered the notification

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ nullable: true })
  entityId: number; // ID of the related entity (e.g., friend request, gift, etc.)

  @Column({ nullable: true })
  entityType: string; // The type of entity (friend_request, gift, payment)

  @Column({ nullable: true })
  message: string;

  @Column({ default: 'unread' })
  status: 'unread' | 'read' | 'dismissed';

  @CreateDateColumn()
  createdAt: Date;
}