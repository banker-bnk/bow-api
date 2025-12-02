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
      .orderBy('u.lastName', 'ASC')
      .addOrderBy('u.firstName', 'ASC')
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

    return this.friendsRepository
      .createQueryBuilder()
      .delete()
      .from(Friend)
      .where(
        '(userId = :userId AND friendId = :friendId) OR (userId = :friendId AND friendId = :userId)',
        { userId: user.id, friendId: friendId }
      )
      .execute();
  }

  /**
   * Returns a paginated, randomly ordered list of users who are NOT friends
   * with the given user (including not the user themself), where friendship is bidirectional.
   *
   * @param userId The user's userId field (not PK id)
   * @param page page number, default 1
   * @param limit results per page, default 10
   */
  async findNonFriendsRandomly(userId: string, { page = 1, limit = 10 }: { page?: number; limit?: number }) {
    // Get the user's id (primary key) from the supplied userId
    const user = await this.usersRepository.findOne({
      where: { userId: userId }
    });
    if (!user) throw new NotFoundException('User not found');

    // Subquery: all user PKs that are friends with this user. (bidirectional)
    // Also include the user's own PK (so we don't suggest themself)
    const friendsSubquery = this.friendsRepository
      .createQueryBuilder('friend')
      .select('CASE WHEN friend.userId = :myId THEN friend.friendId ELSE friend.userId END', 'friendUserId')
      .where('friend.userId = :myId OR friend.friendId = :myId', { myId: user.id });

    // Get total count
    const totalQuery = this.usersRepository
      .createQueryBuilder('u')
      .where('u.id != :myId', { myId: user.id }) // not self
      .andWhere(`u.id NOT IN (${friendsSubquery.getQuery()})`)
      .setParameters(friendsSubquery.getParameters());

    const total = await totalQuery.getCount();

    // Main query, randomly order results and paginate
    const query = this.usersRepository
      .createQueryBuilder('u')
      .where('u.id != :myId', { myId: user.id }) // not self
      .andWhere(`u.id NOT IN (${friendsSubquery.getQuery()})`)
      .setParameters(friendsSubquery.getParameters())
      .orderBy('RANDOM()') // Randomize order; use RAND() if MySQL
      .skip((page - 1) * limit)
      .take(limit);

    const users = await query.getMany();

    return {
      total,
      page,
      limit,
      data: users
    };
  }

  async findNonFriendsRandomlyWithNoInvitations(userId: string, { page = 1, limit = 10 }: { page?: number; limit?: number }) {
    return await this.usersRepository.query(`
      WITH me AS (
        SELECT id FROM public.users WHERE "userId" = $1
      )
      SELECT u.*
      FROM public.users u, me
      WHERE u."userId" <> $1
        AND NOT EXISTS (
          SELECT 1 FROM public.friends f
          WHERE (f."userId" = me.id AND f."friendId" = u.id)
            OR (f."friendId" = me.id AND f."userId" = u.id)
        )
        AND NOT EXISTS (
          SELECT 1 FROM public.friend_invitations fi
          WHERE (fi."senderId" = me.id AND fi."receiverId" = u.id)
            OR (fi."receiverId" = me.id AND fi."senderId" = u.id)
        )
      ORDER BY RANDOM()
      LIMIT $2
      OFFSET $3
    `, [userId, limit, ((page - 1) * limit)]);
  }

}
