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

  async findByUserId(userId: string, { page, limit }: { page: number; limit: number }) {

    const [friends, total] = await this.usersRepository
      .createQueryBuilder('u')
      .innerJoin('friends', 'f',          
        '(f.friendId = u.id AND f.userId = (SELECT id FROM users WHERE "userId" = :userId)) OR (f.userId = u.id AND f.friendId = (SELECT id FROM users WHERE "userId" = :userId))',
        { userId: userId }
      )
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

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
