import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendInvitation } from './entities/friend-invitation';
import { FriendInvitationsService } from './friend-invitations.service';
import { FriendInvitationsController } from './friend-invitations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FriendInvitation])], // Register the entity here
  providers: [FriendInvitationsService],
  controllers: [FriendInvitationsController],
})
export class FriendInvitationsModule {}
