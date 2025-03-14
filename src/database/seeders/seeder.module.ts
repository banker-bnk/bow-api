import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { User } from '../../users/entities/user';
import { Friend } from '../../friends/entities/friend';
import { FriendInvitation } from '../../friend-invitations/entities/friend-invitation';
import { Gift } from '../../gifts/entities/gift';
import { GiftsPayment } from '../../gifts-payments/entities/gifts-payment';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Friend, FriendInvitation, Gift, GiftsPayment],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      User,
      Friend,
      FriendInvitation,
      Gift,
      GiftsPayment,
    ]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {} 