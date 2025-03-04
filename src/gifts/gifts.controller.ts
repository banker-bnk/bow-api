import { Controller, Get, Post, Delete, Param, Req, Body, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GiftsService } from './gifts.service';
import { UsersService } from '../users/users.service';
import { Gift } from './entities/gift';
import { User } from '../users/entities/user';

@Controller('gifts')
export class GiftsController {
  constructor(
    private readonly giftsService: GiftsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({
    description: 'Get all gifts for the authenticated user.',
  })
  async findAll(@Req() req): Promise<Gift> {
    const { id } = await this.usersService.findBySub(req.user.sub);
    return this.giftsService.findByUserId(id);
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
    const authUser: User = await this.usersService.findBySub(req.user.sub);
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
        id: { type: 'integer' },
      },
    },
  })
  async delete(@Req() req, @Body() data) {
    const authUser: User = await this.usersService.findBySub(req.user.sub);
    data.user = authUser.id;
    await this.giftsService.delete(data);
  }
}
