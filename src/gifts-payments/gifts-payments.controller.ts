import { Controller, Get, Post, Body } from '@nestjs/common';
import { GiftsPaymentsService } from './gifts-payments.service';
import { GiftsPayment } from './entities/gifts-payment';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('gifts-payments')
export class GiftsPaymentsController {
  constructor(private readonly giftsPaymentsService: GiftsPaymentsService) {}

  @Get()
  findAll() {
    return this.giftsPaymentsService.findAll();
  }

  @Post()
  @ApiBody({
    description:
      'Creates a payment from a friend to a given gift.',
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'integer' },
        currency: { type: 'string' },
        source: { type: 'string' },
        user: { type: 'integer' },
        gift: { type: 'integer' },
      },
    },
  })
  create(@Body() data: Partial<GiftsPayment>) {
    return this.giftsPaymentsService.create(data);
  }
}
