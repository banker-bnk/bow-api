import { Controller, Get, Post, Delete, Param, Req, Body, UseGuards } from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { Gift } from './entities/gift';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { User } from '../users/entities/user';
import { UsersService } from '../users/users.service';

@Controller('gifts')
export class GiftsController {
  constructor(
    private readonly giftsService: GiftsService,
    private readonly usersService: UsersService) {}
  

  @Get()
  findAll() {
    return this.giftsService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  async create(@Req() req, @Body() data: Partial<Gift>) {
    const userReq = req.user;
    const authUser: User = await this.usersService.findById(userReq.sub);
    data.user = authUser;
    return this.giftsService.create(data);
  }


  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer' }
      },
    },
  })
  async delete(@Req() req, @Body() data) {
      const userReq = req.user;
      const authUser: User = await this.usersService.findById(userReq.sub);
      data.user = authUser.id;
      await this.giftsService.delete(data);
  }
}
