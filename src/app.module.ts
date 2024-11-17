import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthzModule } from './authz/authz.module';
import { FriendInvitationsModule } from './friend-invitations/friend-invitations.module';
import { FriendsModule } from './friends/friends.module';
import { GiftsModule } from './gifts/gifts.module';
import { GiftsPaymentsModule } from './gifts-payments/gifts-payments.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendInvitation } from './friend-invitations/entities/friend-invitation';
import { Friend } from './friends/entities/friend';
import { Gift } from './gifts/entities/gift';
import { GiftsPayment } from './gifts-payments/entities/gifts-payment';
import { User } from './users/entities/user';

@Module({
  imports: [
    AuthzModule,
    FriendInvitationsModule,
    FriendsModule,
    GiftsModule,
    GiftsPaymentsModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '192.168.1.24',
      port: 5432,
      username: 'paezmolina',
      password: 'zequi',
      database: 'bow',
      entities: [FriendInvitation, Friend, Gift, GiftsPayment, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      FriendInvitation,
      Friend,
      Gift,
      GiftsPayment,
      User,
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
