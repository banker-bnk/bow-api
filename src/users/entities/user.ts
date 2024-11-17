import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  userName: string;

  @Column({ nullable: true })
  birthday: Date;

  @Column()
  lastSeen: Date;

  @CreateDateColumn()
  createdAt: Date;
}
