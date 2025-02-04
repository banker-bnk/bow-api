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

  findByUserId(userId: number) {
    return this.friendsRepository.find({
      where: [
        { user: { id: userId } },  // Where the current user is the 'user'
        { friend: { id: userId } }, // Where the current user is the 'friend'
      ] as FindOptionsWhere<Friend>[], // Cast as an array of FindOptionsWhere<Friend>
      relations: ['friend', 'user'], // Include both 'friend' and 'user' relations
    });
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
