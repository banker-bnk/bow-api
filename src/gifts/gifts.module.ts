import { Module } from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { GiftsController } from './gifts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gift } from './entities/gift';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Gift]), TypeOrmModule.forFeature([User]), HttpModule,], // Register the entity here
  providers: [GiftsService, UsersService],
  controllers: [GiftsController],
})
export class GiftsModule {}
