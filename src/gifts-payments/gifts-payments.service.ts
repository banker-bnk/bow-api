import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GiftsPayment } from './entities/gifts-payment';
// import { User } from 'src/users/entities/user';
import { User } from '../users/entities/user';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { getPaymentInfo, preferenceBuilder } from './helpers/payments.helper';
import { PreferenceDto } from './dto/preference.dto';
import { PAYMENT_STATUS } from '../constants';

@Injectable()
export class GiftsPaymentsService {
  private mercadoPago: MercadoPagoConfig;
  private readonly logger = new Logger(GiftsPaymentsService.name);

  constructor(
    @InjectRepository(GiftsPayment)
    private giftsPaymentsRepository: Repository<GiftsPayment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    this.mercadoPago = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });
  }

  findAll(userId: string) {
    return this.giftsPaymentsRepository.find({
      where: { user: { userId } },
      relations: ['user', 'gift'],
    });
  }

  async createPreference(preferenceDto: PreferenceDto) {
    const preferenceData = preferenceBuilder(
      preferenceDto,
      process.env.APP_HOST_URL,
    );

    const preference = await new Preference(this.mercadoPago).create(
      preferenceData,
    );

    console.log('preference', JSON.stringify(preference))

    return preference;
  }

  async savePaymentData(paymentId: string) {
    const payment = await new Payment(this.mercadoPago).get({
      id: paymentId,
    });

    const paymentInfo = getPaymentInfo(payment);

    const existingPayment = await this.giftsPaymentsRepository.findOne({
      where: {
        paymentReferenceId: paymentInfo.paymentReferenceId
      }
    });

    if (!existingPayment) {
      paymentInfo.status = payment.status as PAYMENT_STATUS;
      this.logger.log(`Payment does not exist. Saving payment status as ${payment.status}`)
      await this.create(paymentInfo);
    } 
    
    if (payment?.status === PAYMENT_STATUS.APPROVED && 
      existingPayment?.status === PAYMENT_STATUS.PENDING) {
        existingPayment.status = PAYMENT_STATUS.APPROVED;
        this.logger.log(`Updating payment status as ${existingPayment.status}`);
        await this.giftsPaymentsRepository.save(existingPayment);
    }

    if (payment?.status === PAYMENT_STATUS.REJECTED && 
      existingPayment?.status === PAYMENT_STATUS.PENDING) {
        existingPayment.status = PAYMENT_STATUS.APPROVED;
        this.logger.log(`Deleting payment status with status ${existingPayment.status}`);
        await this.giftsPaymentsRepository.save(existingPayment);
    }

    return undefined;
  }

  async create(data: any) {
    const user = await this.usersRepository.findOne({
      where: { userId: data.user.userId },
    });

    if (!user) throw new NotFoundException('User not found');

    data.user = user;

    const giftPayment = this.giftsPaymentsRepository.create(data);
    return this.giftsPaymentsRepository.save(giftPayment);
  }
}
