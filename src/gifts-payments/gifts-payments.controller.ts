import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { GiftsPaymentsService } from './gifts-payments.service';
import { GiftsPayment } from './entities/gifts-payment';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { PreferenceDto } from './dto/preference.dto';

@Controller('gifts-payments')
export class GiftsPaymentsController {
  constructor(private readonly giftsPaymentsService: GiftsPaymentsService) {}

  @Get()
  @ApiOperation({
    description: 'Get all payments',
  })
  findAll() {
    return this.giftsPaymentsService.findAll();
  }

  @Post('create-preference')
  @ApiBody({
    description: 'Create a preference to send to Mercado Pago.',
    type: PreferenceDto,
  })
  createPreference(@Body() preferenceDto: PreferenceDto) {
    return this.giftsPaymentsService.createPreference(preferenceDto);
  }

  @Post('save')
  @ApiBody({
    description:
      'Saves the payment information from Mercado Pago webhook. The body is the payment object returned by Mercado Pago.',
  })
  async save(@Body() body: any, @Res() res: Response) {
    try {
      const paymentId = body?.data?.id;

      if (!paymentId) {
        return res.status(HttpStatus.NOT_FOUND).json({ success: false });
      }

      await this.giftsPaymentsService.savePaymentData(body?.data?.id);

      return res.status(HttpStatus.OK).json({ success: true });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false });
    }
  }

  @Post('create')
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
