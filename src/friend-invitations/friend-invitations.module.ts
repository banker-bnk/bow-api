import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendInvitation } from './entities/friend-invitation';
import { FriendInvitationsService } from './friend-invitations.service';
import { FriendInvitationsController } from './friend-invitations.controller';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user';
import { MessagesModule } from '../messages/messages.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([FriendInvitation]),
    TypeOrmModule.forFeature([User]),
    MessagesModule,
  ],
  providers: [FriendInvitationsService, UsersService],
  controllers: [FriendInvitationsController],
})
export class FriendInvitationsModule {}
