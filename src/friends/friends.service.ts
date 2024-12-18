import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Friend } from './entities/friend';
import { User } from 'src/users/entities/user';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private friendsRepository: Repository<Friend>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.friendsRepository.find({ relations: ['friend', 'user'] });
  }

  create(data: Partial<Friend>) {
    const friend = this.friendsRepository.create(data);
    return this.friendsRepository.save(friend);
  }

  async delete(data, friendId) {
    const user = await this.usersRepository.findOne({
      where: { userId: data.user },
    });

    if (!user) throw new NotFoundException('User not found');

    return this.friendsRepository.delete({
      user: user,
      friend: friendId,
    } as FindOptionsWhere<Friend>);
  }
}
