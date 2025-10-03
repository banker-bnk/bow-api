import { Controller, Get, Post, Delete, Param, Req, Body, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
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

  @Get("own")
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Get the active gift for the authenticated user.',
    description: 'Returns the most recent active gift for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    type: Gift,
  })
  @ApiResponse({
    status: 404,
    description: 'No active gift for this user',
  })
  async findByUserId(@Req() req): Promise<Gift> {
    const { id } = await this.usersService.findBySub(req.user.sub);
    return this.giftsService.findByUserId(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: '[DEPRECATED - Use /gifts/own] Get the active gift for the authenticated user.',
    description: 'Returns the most recent active gift for the authenticated user. This endpoint is deprecated, use /gifts/own instead.',
  })
  @ApiResponse({
    status: 200,
    type: Gift,
  })
  @ApiResponse({
    status: 404,
    description: 'No active gift for this user',
  })
  async findAll(@Req() req): Promise<Gift> {
    const { id } = await this.usersService.findBySub(req.user.sub);
    return this.giftsService.findByUserId(id);
  }

  @Get(':id')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Find gift by id.',
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
    summary: 'Create or update gift. If body contains an existing id, the gift should be updated. If body does not contain the id, the gift should be created',
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

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Delete a gift from the logged-in user. User info will be taken from access token.',
    description: 'Delete a gift from the logged-in user. User info will be taken from access token.',
  })
  @ApiParam({
    name: 'id',
    description: 'Gift id to delete.',
  })
  async delete(@Req() req, @Param('id') id: string) {
    const authUser: User = await this.usersService.findBySub(req.user.sub);
    console.log(authUser.id);
    return await this.giftsService.delete(Number(id), authUser.id);
  }
}
