import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from './entities/message';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [MessagesService, UsersService],
  controllers: [MessagesController],
})
export class MessagesModule {}


