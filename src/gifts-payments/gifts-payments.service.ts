import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GiftsPayment } from './entities/gifts-payment';
import { User } from '../users/entities/user';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { getPaymentInfo, preferenceBuilder } from './helpers/payments.helper';
import { PreferenceDto } from './dto/preference.dto';
import { PAYMENT_STATUS } from '../constants';
import { EmailService } from '../email/email.service';

@Injectable()
export class GiftsPaymentsService {
  private mercadoPago: MercadoPagoConfig;
  private readonly logger = new Logger(GiftsPaymentsService.name);

  constructor(
    @InjectRepository(GiftsPayment)
    private giftsPaymentsRepository: Repository<GiftsPayment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private emailService: EmailService,
  ) {
    this.mercadoPago = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN_PROD,
    });
  }

  async findAll(userId: string) {
    const payments = await this.giftsPaymentsRepository.find({
      where: { user: { userId } },
      relations: ['user', 'gift', 'gift.user'],
    });
    return payments;
  }

  async createInitPayment(preferenceDto: PreferenceDto) {
    const initPayment = await this.create({
      gift: preferenceDto.giftId,
      user:{userId:preferenceDto.userId},
      amount: preferenceDto.amount,
      currency: 'ARS',
      source: 'Mercado Pago',
      status: PAYMENT_STATUS.INIT,
      ...(preferenceDto?.message && {message: preferenceDto?.message})
    }) as unknown as GiftsPayment;

    return initPayment
  }

  async createPreference(preferenceDto: PreferenceDto) {
    try {
      const { id } = await this.createInitPayment(preferenceDto);
      
      const preferenceData = preferenceBuilder(
       preferenceDto,
       process.env.APP_HOST_URL,
       id
      );
 
      const preference = await new Preference(this.mercadoPago).create(
        preferenceData,
      );

      return preference;
    } catch (error) {
      this.logger.error('Error creating preference');
      throw error;
    }
  }

  async updateGiftPayment(id: number, mercadoPagoPayment: any) {
    try {
      const giftPayment = await this.giftsPaymentsRepository.findOne({
        where: { id },
        relations: ['user'],
      });
  
      if (!giftPayment) {
        this.logger.error(`No gift payment found with id: ${id}`);
        return
      }
  
      const paymentInfo = getPaymentInfo(mercadoPagoPayment);
  
      await this.giftsPaymentsRepository.update(
        {id: giftPayment.id},
        {
          status: paymentInfo.status,
          currency: paymentInfo.currency,
          source: paymentInfo.source
        }
      )

      this.logger.log(`Updated giftPayment with id:${id}, status: ${paymentInfo.status}`)

      // Send confirmation email if payment is approved
      if (paymentInfo.status === PAYMENT_STATUS.APPROVED && giftPayment.user?.email) {
        try {
          const userName = giftPayment.user.firstName || giftPayment.user.userName;
          await this.emailService.sendPaymentConfirmation(
            giftPayment.user.email,
            userName,
            giftPayment.amount,
            paymentInfo.currency,
          );
        } catch (emailError) {
          this.logger.error('Failed to send confirmation email', emailError);
        }
      }
    } catch (error) {
      this.logger.error(`Error updating giftPayment with id:${id}`, error);
    }
    
  }

  async savePaymentData(paymentId: string) {
    const mercadoPagoPayment = await new Payment(this.mercadoPago).get({
      id: paymentId,
    });

    const { id } = mercadoPagoPayment.metadata;

    await this.updateGiftPayment(id, mercadoPagoPayment);
    
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
