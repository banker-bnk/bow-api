import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendInvitation } from './entities/friend-invitation';
import { User } from '../users/entities/user';
import { MessagesService } from '../messages/messages.service';
import { UsersService } from '../users/users.service';


@Injectable()
export class FriendInvitationsService {
  constructor(
    @InjectRepository(FriendInvitation)
    private friendInvitationRepository: Repository<FriendInvitation>,
    private messagesService: MessagesService,
    private usersService: UsersService,
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
  
  async create(data: Partial<FriendInvitation>) {
    const invitation = this.friendInvitationRepository.create(data);
    const savedInvitation = await this.friendInvitationRepository.save(invitation);
    await this.messagesService.create({
      sender: null,
      receiver: data.receiver,
      subject: `You have received an invitation from ${data.sender.firstName} ${data.sender.lastName}!`,
      message: `{messages.friend_request_sent}`
    });
    return savedInvitation;
  }

  async approve(sender: User, receiver: User) {
    const invitation = this.friendInvitationRepository.update(
      { sender: sender, receiver: receiver },
      { status: 'APPROVED' },
    );

    await this.messagesService.create({
      sender: null,
      receiver: receiver,
      subject: `You are now friends with ${sender.firstName} ${sender.lastName}!`,
      message: `{messages.friend_approved}`
    });

    console.log("receiver: " + JSON.stringify(receiver));
    const receiverUser: User = await this.usersService.findBySub(receiver.userId);

    await this.messagesService.create({
      sender: null,
      receiver: sender,
      subject: `You are now friends with ${receiverUser.firstName} ${receiverUser.lastName}!`,
      message: `{messages.friend_approved}`
    });
    
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
