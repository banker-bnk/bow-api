import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user';
import { MessageType } from '../enums/message-type.enum';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  sender: User;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  receiver: User;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: 'unread' })
  status: 'unread' | 'read' | 'archived';

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  actor: Partial<User>; // The user who triggered the message, can be null for system messages

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'enum', enum: MessageType, default: MessageType.SYSTEM })
  type: MessageType;

  @Column({ nullable: true })
  entityId: number; // ID of the related entity (e.g., friend request, gift, etc.)

  @Column({ nullable: true })
  entityType: string; // The type of entity (friend_request, gift, payment)


}


