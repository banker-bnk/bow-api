import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user';

@Entity('friends')
@Unique(['user', 'friend'])
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
