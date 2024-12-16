import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreferenceDto } from './dto/preference.dto';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { getPaymentInfo, preferenceBuilder } from './helpers/payments.helper';
import { User } from '../users/entities/user';
import { Payments } from './entities/payments.entity';

@Injectable()
export class PaymentsService {
  private mercadoPago: MercadoPagoConfig;

  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payments)
    private paymentsRepository: Repository<Payments>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    this.mercadoPago = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });
  }

  async createPreference(preferenceDto: PreferenceDto) {
    const preferenceData = preferenceBuilder(
      preferenceDto,
      'https://machinery-cafe-intended-avatar.trycloudflare.com',
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

      // TODO: confirm the fields
      // TODO: call the create() method to save the payment info in the database.

      return paymentInfo;
    }

    return undefined;
  }

  async create(data: Partial<Payments>) {
    const user = await this.usersRepository.findOne({
      where: { userId: data.user.toString() },
    });

    if (!user) throw new NotFoundException('User not found');

    data.user = user;
    const payment = this.paymentsRepository.create(data);
    return this.paymentsRepository.save(payment);
  }
}
