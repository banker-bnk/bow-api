import { Module } from '@nestjs/common';
import { GiftsPaymentsService } from './gifts-payments.service';
import { GiftsPaymentsController } from './gifts-payments.controller';
import { GiftsPayment } from './entities/gifts-payment';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user';
import { MessagesService } from '../messages/messages.service';
import { Message } from 'src/messages/entities/message';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GiftsPayment]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Message]),
    NotificationsModule,
  ],
  providers: [GiftsPaymentsService, MessagesService],
  controllers: [GiftsPaymentsController],
})
export class GiftsPaymentsModule {}
