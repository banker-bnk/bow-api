import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payments } from './entities/payments.entity';
import { User } from '../users/entities/user';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payments]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
