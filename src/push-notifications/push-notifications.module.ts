import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushNotificationsController } from './push-notifications.controller';
import { PushNotificationService } from './push-notification.service';
import { DeviceToken } from './entities/device-token.entity';
import { User } from '../users/entities/user';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceToken, User])
  ],
  controllers: [PushNotificationsController],
  providers: [PushNotificationService],
  exports: [PushNotificationService],
})
export class PushNotificationsModule {} 