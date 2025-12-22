import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateMessageWithNotification } from './interfaces/create-message-with-notification.interface';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(data: CreateMessageWithNotification): Promise<Message> {
    const { notificationData, ...messageData } = data;
    const entity = this.messagesRepository.create(messageData);
    const savedMessage = await this.messagesRepository.save(entity);

    // Send push notification 1:1 with message
    // Use data.receiver (not savedMessage.receiver) to ensure pushToken is available
    const receiver = data.receiver;
    
    if (receiver?.pushToken) {
      this.logger.log(`Sending push notification for message id:${savedMessage.id} to user id:${receiver.id}`);
      
      // Isolate notification send in try-catch to prevent message creation failure
      try {
        await this.notificationsService.sendPushNotification(
          receiver.pushToken,
          savedMessage.subject,
          savedMessage.message,
          notificationData || undefined,
        );
      } catch (error) {
        this.logger.error(
          `Failed to send push notification for message id:${savedMessage.id}`,
          error.stack,
        );
        // Don't throw - message was created successfully
      }
    } else {
      this.logger.log(`No push token for receiver of message id:${savedMessage.id}`);
    }

    return savedMessage;
  }

  async findById(id: number): Promise<Message> {
    const message = await this.messagesRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver', 'actor'],
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
      relations: ['sender', 'receiver', 'actor'],
      order: { createdAt: 'DESC' },
    });
  }

  async findSent (userId: number): Promise<Message[]> {
    return await this.messagesRepository.find({
      where: [
        { sender: { id: userId } },
      ],
      relations: ['sender', 'receiver', 'actor'],
      order: { createdAt: 'DESC' },
    });
  }

  async findReceived (userId: number): Promise<Message[]> {
    return await this.messagesRepository.find({
      where: [
        { receiver: { id: userId } },
      ],
      relations: ['sender', 'receiver', 'actor'],
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


