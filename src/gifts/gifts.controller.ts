import { Controller, Get, Post, Delete, Param, Req, Body, UseGuards } from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { Gift } from './entities/gift';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../users/entities/user';
import { UsersService } from '../users/users.service';

@Controller('gifts')
export class GiftsController {
  constructor(
    private readonly giftsService: GiftsService,
    private readonly usersService: UsersService) {}
  

  @Get()
  @ApiOperation({
    description: 'Get all gifts.',
  })
  findAll(): Promise<Gift[]> {
    return this.giftsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    description: 'Find gift by id.',
  })
  @ApiResponse({
    status: 200,
    type: Gift,
  })
  findById(@Param('id') id: string) {
    return this.giftsService.findById(Number(id));
  }

  @Post()
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    description:
      'Create or update gift. If body contains an existing id, the gift should be updated. If body does not contain the id, the gift should be created',
  })
  @ApiResponse({
    status: 200,
    type: Gift,
  })
  async create(@Req() req, @Body() data: Partial<Gift>) {
    const userReq = req.user;
    const authUser: User = await this.usersService.findBySub(userReq.sub);
    data.user = authUser;

    if (data.id) {
      return this.giftsService.update(data.id, data);
    }
    
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
