import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGatewayModule } from '../gateway/notifications.gateway.module';
import { Notification } from './entities/notification';
import { NotificationsGateway } from '../gateway/notifications.gateway';
import { User } from '../users/entities/user';
import { PushNotificationsModule } from '../push-notifications/push-notifications.module';
import { DeviceToken } from '../push-notifications/entities/device-token.entity';

@Module({
  imports: [
    NotificationsGatewayModule, 
    PushNotificationsModule, 
    TypeOrmModule.forFeature([Notification, User, DeviceToken])
  ],
  controllers: [NotificationsController],
  providers: [NotificationsGateway, NotificationsService],
})
export class NotificationsModule {}