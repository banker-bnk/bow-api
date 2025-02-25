import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../notifications/entities/notification';
import { User } from '../users/entities/user';


@Module({
  imports: [TypeOrmModule.forFeature([Notification, User])],
  providers: [NotificationsGateway],
  exports: [NotificationsGateway], // Export to use in other modules
})
export class NotificationsGatewayModule {}