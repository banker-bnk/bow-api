import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user';

@Entity('gifts')
export class Gift {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  link: string;

  @Column('decimal')
  price: number;

  @Column()
  currency: string;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => User, (user) => user.gifts, { onDelete: 'RESTRICT' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
