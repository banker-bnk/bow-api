import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @ApiBody({
    description: 'Dont include id, or createdAt',
    type: [User],
  })
  @ApiResponse({
    status: 200,
    description: 'User created.',
    type: [User],
  })
  create(@Body() data: Partial<User>) {
    return this.usersService.create(data);
  }

  @Get('/friends')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get friends birthdays. UserId is retrieved from the JWT.',
    description: 'This endpoint retrieves friends birthdays for a given user.',
  })
  @ApiQuery({
    name: 'date',
    type: 'string',
    description: 'The date to get friends birthdays for.',
  })

  getFriendsBirthdays2(@Req() req, @Query('date') date: string) {
    return this.usersService.getFriendsBirthdays(req.user.sub, date);
  }

  @Get('/friends/:userId')
  @ApiOperation({
    summary: 'Get friends birthdays. UserId is required to be passed as a param.',
    description: 'This endpoint retrieves friends birthdays for a given user.',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'The user id of the user to get friends birthdays for.',
  })
  @ApiQuery({
    name: 'date',
    type: 'string',
    description: 'The date to get friends birthdays for.',
  })
  getFriendsBirthdays(@Param('userId') userId: string, @Query('date') date: string) {
    return this.usersService.getFriendsBirthdays(userId, date);
  }

  @Get(':userId')
  findById(@Param('userId') userId: string) {
    return this.usersService.findById(userId);
  }

}
