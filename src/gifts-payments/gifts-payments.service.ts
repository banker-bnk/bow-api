import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GiftsPayment } from './entities/gifts-payment';
import { User } from '../users/entities/user';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { getPaymentInfo, preferenceBuilder } from './helpers/payments.helper';
import { PreferenceDto } from './dto/preference.dto';
import { PAYMENT_STATUS } from '../constants';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class GiftsPaymentsService {
  private mercadoPago: MercadoPagoConfig;
  private readonly logger = new Logger(GiftsPaymentsService.name);

  constructor(
    @InjectRepository(GiftsPayment)
    private giftsPaymentsRepository: Repository<GiftsPayment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private messagesService: MessagesService,
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

  async findByExternalIdForUser(userSub: string, externalId: string) {
    // Return payments with the given external_id where the current user either made the payment
    // or is the owner of the gift that received the payment
    return this.giftsPaymentsRepository
      .createQueryBuilder('gp')
      .leftJoinAndSelect('gp.user', 'user')
      .leftJoinAndSelect('gp.gift', 'gift')
      .leftJoinAndSelect('gift.user', 'giftOwner')
      .where('gp.external_id = :externalId', { externalId })
      .andWhere('(user.userId = :userSub OR giftOwner.userId = :userSub)', {
        userSub,
      })
      .getMany();
  }

  async updateGiftPayment(
    id: number, 
    paymentId: string, 
    mercadoPagoPayment: any) {
    try {
      const giftPayment = await this.giftsPaymentsRepository.findOne({
        where: { id },
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
          source: paymentInfo.source,
          external_id: paymentId,
        }
      )

      // Send a System Message to the gift owner of the payment being made referencing the user that did the payment

      // Get fresh gift payment with all needed relations (user and gift with owner)
      const updatedGiftPayment = await this.giftsPaymentsRepository.findOne({
        where: { id: giftPayment.id },
        relations: ["user", "gift", "gift.user"]
      });

      if (updatedGiftPayment && updatedGiftPayment.gift && updatedGiftPayment.gift.user && updatedGiftPayment.user) {
        const giftOwner = updatedGiftPayment.gift.user;
        const paymentUser = updatedGiftPayment.user;

        // Compose message
        const subject = `You received a gift payment from ${paymentUser.firstName} ${paymentUser.lastName}!`;
        //const message = `${paymentUser.firstName || paymentUser.email || 'A friend'} has made a payment toward your gift.`
        const message = `{messages.payment_approved}`;

        // Call messagesService.create with sender as system (null) or appropriate value, and receiver as the gift owner
        if (this.messagesService && typeof this.messagesService.create === "function") {
          await this.messagesService.create({
            sender: null, // sender null or some SYSTEM_USER, depending on implementation
            receiver: giftOwner,
            subject,
            message
          });
        }
      }

      this.logger.log(`Updated giftPayment with id:${id}, status: ${paymentInfo.status}`)
    } catch (error) {
      this.logger.error(`Error updating giftPayment with id:${id}`, error);
    }
    
  }

  async savePaymentData(paymentId: string) {
    const mercadoPagoPayment = await new Payment(this.mercadoPago).get({
      id: paymentId,
    });

    const { id } = mercadoPagoPayment.metadata;

    await this.updateGiftPayment(id, paymentId, mercadoPagoPayment);
    
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
