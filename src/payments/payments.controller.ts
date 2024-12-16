import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PreferenceDto } from './dto/preference.dto';
import { Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-preference')
  createPreference(@Body() preferenceDto: PreferenceDto) {
    return this.paymentsService.createPreference(preferenceDto);
  }

  @Post('payment-data')
  async paymentData(@Body() body: any, @Res() res: Response) {
    try {
      const paymentId = body?.data?.id;

      if (!paymentId) {
        return res.status(400).json({ success: false });
      }

      const paymentInfo = await this.paymentsService.savePaymentData(
        body?.data?.id,
      );
      console.log('paymentInfo', paymentInfo);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.log('error', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false });
    }
  }
}
