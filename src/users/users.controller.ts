import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  Logger,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() req) {
    Logger.log('Req user ', req.user);
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

  @Get(':userId')
  findById(@Param('userId') userId: string) {
    return this.usersService.findById(userId);
  }

  @Get('/friends/:userId')
  getFriendsBirthdays(@Param('userId') userId: string, @Query('date') date: string) {
    return this.usersService.getFriendsBirthdays(userId, date);
  }
}
