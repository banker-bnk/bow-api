import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGatewayModule } from '../gateway/notifications.gateway.module';
import { Notification } from './entities/notification';
import { NotificationsGateway } from '../gateway/notifications.gateway';
import { User } from '../users/entities/user';

@Module({
  imports: [NotificationsGatewayModule, TypeOrmModule.forFeature([Notification]),TypeOrmModule.forFeature([User])],
  controllers: [NotificationsController],
  providers: [NotificationsGateway, NotificationsService],
})
export class NotificationsModule {}