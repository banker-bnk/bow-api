import { Controller, Get, Post, Body, UseGuards, Req, Logger } from '@nestjs/common';
import { GiftsPaymentsService } from './gifts-payments.service';
import { GiftsPayment } from './entities/gifts-payment';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('gifts-payments')
export class GiftsPaymentsController {
  constructor(private readonly giftsPaymentsService: GiftsPaymentsService) {}

  @Get()
  findAll() {
    return this.giftsPaymentsService.findAll();
  }

  @Post()
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({
    description:
      'Creates a payment from a friend to a given gift. Backing user is retrieved from the JWT.',
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'integer' },
        currency: { type: 'string' },
        source: { type: 'string' },
        gift: { type: 'integer' },
      },
    },
  })
  create(@Req() req, @Body() data: Partial<GiftsPayment>) {
    data.user = req.user.sub;
    return this.giftsPaymentsService.create(data);
  }
}
