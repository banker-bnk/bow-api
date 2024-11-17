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
}
