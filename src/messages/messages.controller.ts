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
  @Get('/sent')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get all sent messages for the authenticated user' })
  @ApiResponse({ status: 200, type: [Message] })
  async findAllSent(@Req() req): Promise<Message[]> {
    const authUser: User = await this.usersService.findBySub(req.user.sub);
    return await this.messagesService.findSent(authUser.id);
  }
  
  @Get('/received')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get all received messages for the authenticated user' })
  @ApiResponse({ status: 200, type: [Message] })
  async findAllReceived(@Req() req): Promise<Message[]> {
    const authUser: User = await this.usersService.findBySub(req.user.sub);
    return await this.messagesService.findReceived(authUser.id);
  }

  @Get('/unread/count')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get the count of unread messages for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Number of unread messages', schema: { type: 'object', properties: { count: { type: 'number' } } } })
  async countUnreadMessages(@Req() req): Promise<{ count: number }> {
    const authUser: User = await this.usersService.findBySub(req.user.sub);
    const count = await this.messagesService.countUnreadForUser(authUser.id);
    return { count };
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

  @Post("/system")
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Create a message from System.',
    description: 'Create a message from System. Sender will be hardcoded with System info. Only pass receiver, subject and message. All others are auto filled.',
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
  async createSystem(@Body() data: Partial<Message>): Promise<Message> {
    data.sender = null;
    var message = await this.messagesService.create(data);
    message.sender = {
      id: -1,
      userId: "Bow",
      userName: "Bow",
      email: "",
      phone: "",
      firstName: "Bow",
      lastName: "Bow",
      image: "https://res.cloudinary.com/dqpicciui/image/upload/v1760443941/icon_fczjxb.png",
      address: "",
      birthday: null,
      lastSeen: null,
      createdAt: null,
      sentInvitations: [],
      receivedInvitations: [],
      friends: [],
      gifts: [],
      giftPayments: [],
      notifications: [],
      onboardingCompleted: false
    };

    return message;
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


