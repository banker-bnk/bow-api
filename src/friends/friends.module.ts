import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { Friend } from './entities/friend';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Friend])], // Register the entity here
  providers: [FriendsService],
  controllers: [FriendsController],
})
export class FriendsModule {}
