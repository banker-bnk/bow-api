import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gift } from './entities/gift';

@Injectable()
export class GiftsService {
  constructor(
    @InjectRepository(Gift)
    private giftsRepository: Repository<Gift>,
  ) {}

  findAll() {
    return this.giftsRepository.find();
  }

  create(data: Partial<Gift>) {
    const gift = this.giftsRepository.create(data);
    return this.giftsRepository.save(gift);
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
}
