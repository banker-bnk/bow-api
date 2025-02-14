import { Injectable } from '@nestjs/common';
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

  findAll() {
    return this.friendInvitationRepository.find();
  }

  create(data: Partial<FriendInvitation>) {
    const invitation = this.friendInvitationRepository.create(data);
    return this.friendInvitationRepository.save(invitation);
  }

  approve(sender: User, receiver: User) {
    const invitation = this.friendInvitationRepository.update(
      {
        sender: sender,
        receiver: receiver,
      },
      {
        status: 'APPROVED',
      },
    );
    return invitation;
  }
}
