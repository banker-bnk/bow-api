import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from './entities/friend';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private friendsRepository: Repository<Friend>,
  ) {}

  findAll() {
    return this.friendsRepository.find({ relations: ['friend', 'user'] });
  }

  create(data: Partial<Friend>) {
    const friend = this.friendsRepository.create(data);
    return this.friendsRepository.save(friend);
  }
}
