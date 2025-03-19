import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { Friend } from './entities/friend';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
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
  @ApiOperation({
    summary: 'Get all friends (paginated). User info will be taken from access token.',
    description: 'This endpoint returns a paginated list of the logged-in user\'s friends.',
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'Page number (default is 1)',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'Number of friends per page (default is 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated friends list.',
    type: [Friend],
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req,
  ) {
    return this.friendsService.findByUserId(req.user.sub, { page, limit });
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Delete a friend from the logged-in user. User info will be taken from access token.',
  })
  @ApiBody({
    description: 'Friend id to delete.',
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
