import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gift } from './entities/gift';

@Injectable()
export class GiftsService {
  constructor(
    @InjectRepository(Gift)
    private giftsRepository: Repository<Gift>,
  ) {}

  findAll(): Promise<Gift[]> {
    return this.giftsRepository.find();
  }

  create(data: Partial<Gift>): Promise<Gift> {
    const gift = this.giftsRepository.create(data);
    return this.giftsRepository.save(gift);
  }

  async update(id: number, data: Partial<Gift>): Promise<Gift> {
    await this.giftsRepository.update(id, data);
    return this.giftsRepository.findOneBy({ id });
  }

  async delete(data: { id:number; user: number }) {
    const gift = await this.giftsRepository.findOne({
      where: { id: data.id },
      relations: ['user']
    });

    if (!gift) {
      throw new Error('Gift not found');
    }

    if (gift.user.id !== data.user) {
      throw new Error('This gift does not belong to the specified user');
    }

    await this.giftsRepository.remove(gift);
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
