import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from './entities/message';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user';
import { NotificationsGateway } from 'src/gateway/notifications.gateway';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    TypeOrmModule.forFeature([User]),
    NotificationsModule,
  ],
  providers: [MessagesService, UsersService, NotificationsGateway],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}


