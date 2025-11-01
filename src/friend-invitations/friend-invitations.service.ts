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

    console.log("111 sender: " + JSON.stringify(sender));
    const senderUser = await this.usersService.findById(sender.id);
    console.log("222 senderUser: " + JSON.stringify(senderUser));


    await this.messagesService.create({
      sender: null,
      receiver: receiver,
      subject: `You are now friends with ${senderUser.firstName} ${senderUser.lastName}!`,
      message: `{messages.friend_approved}`
    });

    console.log("333 receiver: " + JSON.stringify(receiver));
    const receiverUser: User = await this.usersService.findBySub(receiver.userId);
    console.log("222 receiverUser: " + JSON.stringify(receiverUser));

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
