import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user';

@Entity('friends')
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.friends, { onDelete: 'RESTRICT' })
  user: User;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  friend: User;

  @CreateDateColumn()
  createdAt: Date;
}
