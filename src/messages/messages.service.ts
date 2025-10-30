import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
  ) {}

  async create(data: Partial<Message>): Promise<Message> {
    const entity = this.messagesRepository.create(data);
    return await this.messagesRepository.save(entity);
  }

  async findById(id: number): Promise<Message> {
    const message = await this.messagesRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver'],
    });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  async findAllForUser(userId: number): Promise<Message[]> {
    return await this.messagesRepository.find({
      where: [
        { sender: { id: userId } },
        { receiver: { id: userId } },
      ],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'DESC' },
    });
  }

  async findSent (userId: number): Promise<Message[]> {
    return await this.messagesRepository.find({
      where: [
        { sender: { id: userId } },
      ],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'DESC' },
    });
  }

  async findReceived (userId: number): Promise<Message[]> {
    return await this.messagesRepository.find({
      where: [
        { receiver: { id: userId } },
      ],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'DESC' },
    });
  }


  async countUnreadForUser(userId: number): Promise<number> {
    return await this.messagesRepository.count({
      where: { receiver: { id: userId }, status: 'unread' },
    });
  }

  async markAsRead(id: number): Promise<Message> {
    await this.messagesRepository.update(id, { status: 'read' });
    return await this.findById(id);
  }

  async delete(id: number) {
    await this.messagesRepository.delete({ id });
  }
}


