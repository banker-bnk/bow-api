import { Controller, Get, Post, Body } from '@nestjs/common';
import { GiftsPaymentsService } from './gifts-payments.service';
import { GiftsPayment } from './entities/gifts-payment';

@Controller('gifts-payments')
export class GiftsPaymentsController {
  constructor(private readonly giftsPaymentsService: GiftsPaymentsService) {}

  @Get()
  findAll() {
    return this.giftsPaymentsService.findAll();
  }

  @Post()
  create(@Body() data: Partial<GiftsPayment>) {
    return this.giftsPaymentsService.create(data);
  }
}
