import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user';

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
  actor: User; // The user who triggered the message

  @CreateDateColumn()
  createdAt: Date;

}


