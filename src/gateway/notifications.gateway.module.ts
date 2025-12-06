import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../messages/entities/message';
import { User } from '../users/entities/user';


@Module({
  imports: [TypeOrmModule.forFeature([Message, User])],
  providers: [NotificationsGateway],
  exports: [NotificationsGateway], // Export to use in other modules
})
export class NotificationsGatewayModule {}