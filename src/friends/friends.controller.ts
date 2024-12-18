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

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  findAll() {
    return this.friendsService.findAll();
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
