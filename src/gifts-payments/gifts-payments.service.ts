import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GiftsPayment } from './entities/gifts-payment';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user';

@Injectable()
export class GiftsPaymentsService {
  constructor(
    @InjectRepository(GiftsPayment)
    private giftsPaymentsRepository: Repository<GiftsPayment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.giftsPaymentsRepository.find();
  }

  async create(data: Partial<GiftsPayment>) {
    const user = await this.usersRepository.findOne({
      where: { userId: data.user.toString() },
    });

    if (!user) throw new NotFoundException('User not found');

    data.user = user;
    const giftPayment = this.giftsPaymentsRepository.create(data);
    return this.giftsPaymentsRepository.save(giftPayment);
  }
}
