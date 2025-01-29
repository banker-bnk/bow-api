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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

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

  @Get('/friends-home/:userId')
  @ApiOperation({
    summary:
      'Get friends birthdays grouped by upcoming birthdays. UserId is required to be passed as a param.',
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

  friendsHome(
    @Param('userId') userId: string,
    @Query('date') date: string,
  ) {
    return this.usersService.friendsBirthdayUpcoming(userId, date);
  }

  @Get('/friends-calendar')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary:
      'Get friends birthdays grouped by upcoming birthdays. UserId is retrieved from the JWT.',
    description: 'This endpoint retrieves friends birthdays for a given user.',
  })

  fiendsCalendarSecured(@Req() req) {
    return this.usersService.friendsBirthdayByMonth(req.user.sub);
  }


  @Get('/friends-calendar/:userId')
  @ApiOperation({
    summary:
      'Get friends birthdays grouped by upcoming birthdays. UserId is required to be passed as a param.',
    description: 'This endpoint retrieves friends birthdays for a given user.',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'The user id of the user to get friends birthdays for.',
  })
  fiendsCalendar(@Param('userId') userId: string) {
    return this.usersService.friendsBirthdayByMonth(userId);
  }

  @Get('search')
@ApiOperation({
  summary: 'Search users by search term (userName, firstName, lastName, or email)',
  description: 'Search users by search term, matching userName, firstName, lastName, or email.',
})
@ApiQuery({
  name: 'searchTerm',
  type: 'string',
  required: true,
  description: 'The search term to search for across userName, firstName, lastName, or email.',
})
@ApiResponse({
  status: 200,
  description: 'Users found by search term.',
})
@ApiResponse({
  status: 400,
  description: 'Bad request if no search term is provided.',
})
async searchUsers(@Query('searchTerm') searchTerm: string) {
  if (!searchTerm) {
    throw new Error('Search term is required.');
  }

  return this.usersService.searchUsers(searchTerm);
}

  @Get('/me')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard('jwt')) // Ensure the user is authenticated
  @ApiOperation({
    summary: 'Get the currently authenticated user',
    description: 'This endpoint returns the information of the logged-in user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully.',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized if the user is not authenticated.',
  })
  async me(@Req() req) {
    const userId = req.user.sub;
    return this.usersService.findBySub(userId);
  }

  @Get(':userId')
  findById(@Param('userId') userId: string) {
    return this.usersService.findById(userId);
  }
}
