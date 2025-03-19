import { Controller, Get, Post, Body, UseGuards, Req, Logger, Delete, Param } from '@nestjs/common';
import { FriendInvitationsService } from './friend-invitations.service';
import { UsersService } from '../users/users.service';
import { FriendInvitation } from './entities/friend-invitation';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/entities/user';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('friend-invitations')
export class FriendInvitationsController {
  constructor(
    private readonly friendInvitationsService: FriendInvitationsService,
    private readonly usersService: UsersService,
  ) {}

  @Get('received')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get all friend invitations received by the current user.',
    description: 'Get all friend invitations received by the current user.',
  })
  @ApiBearerAuth('JWT')
  async findAll(@Req() req) {
    const userReq = req.user;  
    const user: User = await this.usersService.findBySub(userReq.sub);
    return this.friendInvitationsService.findAll(user);
  }

  @Get('sent')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get all friend invitations sent by the current user.',
    description: 'Get all friend invitations sent by the current user.',
  })
  @ApiBearerAuth('JWT')
  async findAllSent(@Req() req) {
    const userReq = req.user;
    const user: User = await this.usersService.findBySub(userReq.sub);
    return this.friendInvitationsService.findAllSent(user);
  }
  
  

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Create a friend invitation.',
    description: 'Create a friend invitation. Sender info will be taken from access token.',
  })
  @ApiBody({
    description: 'Information of the invitation receiver. Sender info will be taken from access token.',
    schema: {
      type: 'object',
      properties: {
        receiver: { type: 'integer' },
      },
    },
  })
  async create(@Req() req, @Body() body: Partial<FriendInvitation>) {
    const userReq = req.user;
    const senderUser: User = await this.usersService.findBySub(userReq.sub);
    body.sender = senderUser;
    return this.friendInvitationsService.create(body);
  }

  @Post('approve')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Approve an invitation of a given sender. Receiver info will be taken from access token.',
    description: 'Approve an invitation of a given sender. Receiver info will be taken from access token.',
  })
  @ApiBody({
    description:
      'Approve an invitation of a given sender. Receiver info will be taken from access token.',
    schema: {
      type: 'object',
      properties: {
        sender: { type: 'integer' },
      },
    },
  })
  async approve(@Req() req, @Body() body: Partial<FriendInvitation>) {
    const userReq = req.user;
    const receiverUser: User = await this.usersService.findBySub(userReq.sub);
    return await this.friendInvitationsService.approve(
      body.sender,
      receiverUser,
    );
  }

  @Post('reject')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Reject an invitation of a given sender. Receiver info will be taken from access token.',
    description: 'Reject an invitation of a given sender. Receiver info will be taken from access token.',
  })
  @ApiBody({
    description:
      'Reject an invitation of a given sender. Receiver info will be taken from access token.',
    schema: {
      type: 'object',
      properties: {
        sender: { type: 'integer' },
      },
    },
  })
  async reject(@Req() req, @Body() body: Partial<FriendInvitation>) {
    const userReq = req.user;
    const receiverUser: User = await this.usersService.findBySub(userReq.sub);
    return await this.friendInvitationsService.reject(
      body.sender,
      receiverUser,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Delete a friend-invitation by id.',
    description: 'Delete a friend invitation by id.',
  })
  @ApiBearerAuth('JWT')
  async delete(@Param('id') id: string, @Req() req) {
    return await this.friendInvitationsService.delete(id);
  }
}
