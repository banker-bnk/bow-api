import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendInvitation } from './entities/friend-invitation';
import { User } from '../users/entities/user';

@Injectable()
export class FriendInvitationsService {
  constructor(
    @InjectRepository(FriendInvitation)
    private friendInvitationRepository: Repository<FriendInvitation>,
  ) {}

  async findAll(user: User) {
    return await this.friendInvitationRepository.find({
      where: {
        receiver: { id: user.id },
      },
      relations: ['sender'],
      select: {
        sender: {
          id: true,
          firstName: true,
          lastName: true,
          image: true,
          userName: true,
        }
      }
    });
  }

  async findAllSent(user: User) {
    return await this.friendInvitationRepository.find({
      where: {
        sender: { id: user.id },
      },
      relations: ['receiver'],
      select: {
        receiver: {
          id: true,
          firstName: true,
          lastName: true,
          image: true,
          userName: true,
        }
      }

    });
  }
  
  create(data: Partial<FriendInvitation>) {
    const invitation = this.friendInvitationRepository.create(data);
    return this.friendInvitationRepository.save(invitation);
  }

  approve(sender: User, receiver: User) {
    const invitation = this.friendInvitationRepository.update(
      { sender: sender, receiver: receiver },
      { status: 'APPROVED' },
    );
    return invitation;
  }

  reject(sender: User, receiver: User) {
    const invitation = this.friendInvitationRepository.update(
      { sender: sender, receiver: receiver },
      { status: 'REJECTED' },
    );
    return invitation;
  }

  delete(id: string) {
    return this.friendInvitationRepository.delete(id);
  }
}
