import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Friend } from './entities/friend';
import { User } from '../users/entities/user';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private friendsRepository: Repository<Friend>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByUserId(userId: number, { page, limit }: { page: number; limit: number }) {
    const [friends, total] = await this.friendsRepository.findAndCount({
      where: [
        { user: { id: userId } },
        { friend: { id: userId } },
      ],
      relations: ['friend', 'user'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      total,
      page,
      limit,
      data: friends,
    };
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
