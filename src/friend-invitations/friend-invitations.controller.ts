import { Controller, Get, Post, Body } from '@nestjs/common';
import { FriendInvitationsService } from './friend-invitations.service';
import { FriendInvitation } from './entities/friend-invitation';

@Controller('friend-invitations')
export class FriendInvitationsController {
  constructor(
    private readonly friendInvitationsService: FriendInvitationsService,
  ) {}

  @Get()
  findAll() {
    return this.friendInvitationsService.findAll();
  }

  @Post()
  create(@Body() data: Partial<FriendInvitation>) {
    return this.friendInvitationsService.create(data);
  }
}
