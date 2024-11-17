import { Module } from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { GiftsController } from './gifts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gift } from './entities/gift';

@Module({
  imports: [TypeOrmModule.forFeature([Gift])], // Register the entity here
  providers: [GiftsService],
  controllers: [GiftsController],
})
export class GiftsModule {}
