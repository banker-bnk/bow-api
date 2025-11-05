import { Injectable, NotFoundException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeliService } from "../meli/meli.service"
import { Gift } from './entities/gift';

@Injectable()
export class GiftsService {
  constructor(
    @InjectRepository(Gift)
    private giftsRepository: Repository<Gift>,
    private readonly meliService: MeliService,
  ) {}

  async findAllByUserId(userId: number): Promise<Gift[]> {
    return this.giftsRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['user', 'giftsPayments', 'giftsPayments.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findLastSuccessfulByUserId(userId: number): Promise<Gift> {
    const gift = await this.giftsRepository.findOne({
      where: {
        user: { id: userId },
        successful: true,
      },
      relations: ['user', 'giftsPayments', 'giftsPayments.user'],
      order: { createdAt: 'DESC' },
    });

    if (!gift) {
      throw new NotFoundException('No successful gifts for this user');
    }

    return gift;
  }

  async findByUserId(userId: number): Promise<Gift & { totalAmount: string }> {
    const gift = await this.giftsRepository.findOne({
      where: {
        user: { id: userId },
        active: true,
      },
      relations: ['user', 'giftsPayments', 'giftsPayments.user'],
      order: { id: 'DESC' },
    });

    if (!gift) {
      throw new NotFoundException('No active gift for this user');
    }

    const totalAmount = gift.giftsPayments
      ? gift.giftsPayments.reduce((sum, payment) => sum + Number(payment.amount), 0).toFixed(2)
      : "0.00";

    return {
      ...gift,
      totalAmount,
    };
  }

  async create(data: Partial<Gift>): Promise<Gift> {
    // Trim the URL to remove any non-URL text from Mercado Libre share feature
    data.link = this.meliService.extractUrlFromText(data.link);
    const { title, price, imageUrl } = await this.meliService.getProductDetailsFromUrl(data.link);
    data.title = title;
    data.price = price;
    data.image = imageUrl;
    const gift = this.giftsRepository.create(data);
    return this.giftsRepository.save(gift);
  }

  async update(id: number, data: Partial<Gift>): Promise<Gift> {
    await this.giftsRepository.update(id, data);
    return this.giftsRepository.findOneBy({ id });
  }

  async delete(id: number, userId: number) {
    return this.giftsRepository.delete({ id, user: { id: userId } });
  }

  async findById(id: number): Promise<Gift & { totalAmount: string }> {
    const gift = await this.giftsRepository.findOne({
      where: {
        id,
        active: true,
      },
      relations: ['user', 'giftsPayments', 'giftsPayments.user'],
      order: { id: 'DESC' },
    });

    if (!gift) {
      throw new NotFoundException('No active gift for this user');
    }

    const totalAmount = gift.giftsPayments
      ? gift.giftsPayments.reduce((sum, payment) => sum + Number(payment.amount), 0).toFixed(2)
      : "0.00";

    return {
      ...gift,
      totalAmount,
    };
  }

  
}
