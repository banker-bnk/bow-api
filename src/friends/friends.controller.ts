import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { Friend } from './entities/friend';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { User } from '../users/entities/user';
import { UsersService } from '../users/users.service';

@Controller('friends')
export class FriendsController {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly usersService: UsersService
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  async findAll(@Req() req) {
    const userReq = req.user;
    const authUser: User = await this.usersService.findBySub(userReq.sub);
    const userId = authUser.id;
    return this.friendsService.findByUserId(userId);  // Pass it to the service to fetch the friends
  }

  @Post()
  create(@Body() data: Partial<Friend>) {
    return this.friendsService.create(data);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiBody({
    description: 'XX.',
    schema: {
      type: 'object',
      properties: {
        friendId: { type: 'integer' },
      },
    },
  })
  async delete(@Req() req, @Body() data) {
    data.user = req.user.sub;
    return await this.friendsService.delete(data, data.friendId);
  }
}
