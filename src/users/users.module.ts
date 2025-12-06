import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/messages/entities/message';

@Module({
  imports: [TypeOrmModule.forFeature([User]),TypeOrmModule.forFeature([Message])], // Register the entity here
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
