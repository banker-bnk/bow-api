import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user';
import { Notification } from '../notifications/entities/notification';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User]),TypeOrmModule.forFeature([Notification])], // Register the entity here
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
