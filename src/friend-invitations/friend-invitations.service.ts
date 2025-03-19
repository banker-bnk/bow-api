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
    const invitations = await this.friendInvitationRepository.find({
      where: {
        receiver: { id: user.id },
      },
      relations: ['sender', 'receiver']
    });

    return invitations.map(invitation => ({
      ...invitation,
      senderId: invitation.sender.id,
      receiverId: invitation.receiver.id,
    }));
  }

  async findAllSent(user: User) {
    const invitations = await this.friendInvitationRepository.find({
      where: {
        sender: { id: user.id },
      },
      relations: ['sender', 'receiver']
    });

    return invitations.map(invitation => ({
      ...invitation,
      senderId: invitation.sender.id,
      receiverId: invitation.receiver.id,
    }));
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
}
