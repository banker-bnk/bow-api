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
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './notifications/entities/notification';
import { GiftsPayment } from './gifts-payments/entities/gifts-payment';
import { NotificationsGatewayModule } from './gateway/notifications.gateway.module';
import { User } from './users/entities/user';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PushNotificationsModule } from './push-notifications/push-notifications.module';

@Module({
  imports: [
    AuthzModule,
    FriendInvitationsModule,
    FriendsModule,
    GiftsModule,
    GiftsPaymentsModule,
    UsersModule,
    NotificationsModule,
    NotificationsGatewayModule,
    PushNotificationsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [FriendInvitation, Friend, Gift, GiftsPayment, User, Notification],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      FriendInvitation,
      Friend,
      Gift,
      GiftsPayment,
      User,
      Notification
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Path to your static files
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
