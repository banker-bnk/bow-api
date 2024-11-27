import { Module } from '@nestjs/common';
import { GiftsPaymentsService } from './gifts-payments.service';
import { GiftsPaymentsController } from './gifts-payments.controller';
import { GiftsPayment } from './entities/gifts-payment';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user';

@Module({
  imports: [
    TypeOrmModule.forFeature([GiftsPayment]),
    TypeOrmModule.forFeature([User]),
  ], // Register the entity here
  providers: [GiftsPaymentsService],
  controllers: [GiftsPaymentsController],
})
export class GiftsPaymentsModule {}
