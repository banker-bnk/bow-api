import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Message } from './entities/message';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get all messages for the authenticated user' })
  @ApiResponse({ status: 200, type: [Message] })
  async findAllForAuthUser(@Req() req): Promise<Message[]> {
    const authUser: User = await this.usersService.findBySub(req.user.sub);
    return await this.messagesService.findAllForUser(authUser.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get a single message by id' })
  @ApiResponse({ status: 200, type: Message })
  async findById(@Param('id') id: string): Promise<Message> {
    return await this.messagesService.findById(Number(id));
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Create a message.',
    description: 'Create a message. Only pass receiver, subject and message. All others are auto filled.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        receiver: { type: 'object' },
        subject: { type: 'string' },
        message: { type: 'string' },
      },
      required: ['receiver', 'subject', 'message'],
    },
  })
  @ApiResponse({ status: 201, type: Message })
  async create(@Req() req, @Body() data: Partial<Message>): Promise<Message> {
    const authUser: User = await this.usersService.findBySub(req.user.sub);
    data.sender = authUser;
    return await this.messagesService.create(data);
  }

  @Patch(':id/read')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Mark a message as read' })
  async markAsRead(@Param('id') id: string): Promise<Message> {
    return await this.messagesService.markAsRead(Number(id));
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete a message' })
  async delete(@Param('id') id: string) {
    await this.messagesService.delete(Number(id));
    return { message: 'Message deleted successfully' };
  }
}


