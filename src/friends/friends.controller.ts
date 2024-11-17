import { Controller, Get, Post, Body } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { Friend } from './entities/friend';

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
}
