import { Injectable, Logger } from '@nestjs/common';
import { PreferenceDto } from './dto/preference.dto';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { getPaymentInfo, preferenceBuilder } from './helpers/payments.helper';

@Injectable()
export class PaymentsService {
  private mercadoPago: MercadoPagoConfig;

  private readonly logger = new Logger(PaymentsService.name);

  constructor() {
    this.mercadoPago = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });
  }

  async createPreference(preferenceDto: PreferenceDto) {
    const preferenceData = preferenceBuilder(
      preferenceDto,
      'https://fx-crew-forest-huge.trycloudflare.com',
      // process.env.APP_HOST_URL,
    );

    const preference = await new Preference(this.mercadoPago).create(
      preferenceData,
    );

    return preference;
  }

  async savePaymentData(paymentId: string) {
    const payment = await new Payment(this.mercadoPago).get({
      id: paymentId,
    });

    if (payment?.status === 'approved') {
      const paymentInfo = getPaymentInfo(payment);

      return paymentInfo;
    }

    return undefined;
  }
}
