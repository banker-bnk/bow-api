import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { FriendInvitationsService } from './friend-invitations.service';
import { UsersService } from '../users/users.service';
import { FriendInvitation } from './entities/friend-invitation';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user';

@Controller('friend-invitations')
export class FriendInvitationsController {
  constructor(
    private readonly friendInvitationsService: FriendInvitationsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  findAll() {
    return this.friendInvitationsService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Req() req, @Body() body: Partial<FriendInvitation>) {
    const userReq = req.user;
    const senderUser: User = await this.usersService.findById(userReq.sub);
    body.sender = senderUser;
    return this.friendInvitationsService.create(body);
  }

  @Post('approve')
  @UseGuards(AuthGuard('jwt'))
  async approve(@Req() req, @Body() body: Partial<FriendInvitation>) {
    const userReq = req.user;
    const receiverUser: User = await this.usersService.findById(userReq.sub);
    return await this.friendInvitationsService.approve(
      body.sender,
      receiverUser,
    );
  }
}
