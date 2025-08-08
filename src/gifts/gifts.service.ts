import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
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

  async findByUserId(userId: number): Promise<Gift> {
    const gift = await this.giftsRepository.findOne({
      where: {
        user: { id: userId },
        active: true,
      },
      relations: ['user'],
      order: { id: 'DESC' },
    });

    if (!gift) {
      throw new NotFoundException('No active gift for this user');
    }

    return gift;
  }

  async create(data: Partial<Gift>): Promise<Gift> {
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

  async findById(id: number) {
    const gift = await this.giftsRepository
      .createQueryBuilder('gift')
      .leftJoinAndSelect('gift.giftsPayments', 'giftsPayments')
      .leftJoinAndSelect('giftsPayments.user', 'user')
      .select([
        'gift',
        'giftsPayments.amount',
        'user.id',
        'user.userName',
        'user.lastName',
        'user.image',
      ])
      .where('gift.id = :id', { id })
      .getOne();

    if (!gift) {
      throw new NotFoundException(`Gift with ID ${id} not found`);
    }

    const totalAmount = gift.giftsPayments
      .reduce((sum, payment) => {
        return sum + Number(payment.amount);
      }, 0)
      .toFixed(2);

    return {
      ...gift,
      totalAmount,
    };
  }
}
