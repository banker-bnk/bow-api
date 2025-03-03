import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { GiftsService } from './gifts.service';
import { UsersService } from '../users/users.service';
import { MeliService } from 'src/meli/meli.service';
import { GiftsController } from './gifts.controller';
import { MeliController } from 'src/meli/meli.controller';
import { Gift } from './entities/gift';
import { User } from '../users/entities/user';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gift]),
    TypeOrmModule.forFeature([User]),
    HttpModule,
  ],
  providers: [GiftsService, UsersService, MeliService],
  controllers: [GiftsController, MeliController],
})
export class GiftsModule {}
