import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { Friend } from './entities/friend';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friend]),
    TypeOrmModule.forFeature([User]),
  ], // Register the entity here
  providers: [FriendsService, UsersService],
  controllers: [FriendsController],
})
export class FriendsModule {}
