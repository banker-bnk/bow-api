import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateMessageWithNotification } from './interfaces/create-message-with-notification.interface';
import { User } from '../users/entities/user';

interface NotificationText {
  title: string;
  body: string;
}

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Generate notification text from message placeholders
   * TODO: Add i18n support using receiver.locale when available
   * TODO: Add detailed context (amounts, names) when i18n is implemented
   */
  private generateNotificationText(
    subject: string,
    message: string,
    actor?: Partial<User>,
    context?: Record<string, any>,
  ): NotificationText {
    const actorName = actor?.firstName || actor?.userName || 'Someone';
    
    // Map placeholder keys to notification text (English, generic for now)
    const notificationMap: Record<string, NotificationText> = {
      '{messages.payment_sent_subject}': {
        title: 'Payment sent!',
        body: 'Your payment was sent successfully',
      },
      '{messages.payment_received_subject}': {
        title: 'Payment received!',
        body: `${actorName} sent you a payment`,
      },
      '{messages.friend_request_sent_subject}': {
        title: 'Friend request',
        body: `${actorName} sent you a friend request`,
      },
      '{messages.friend_approved_subject}': {
        title: 'Friend request accepted',
        body: `${actorName} accepted your friend request`,
      },
    };

    // Return mapped notification or fall back to subject/message
    return notificationMap[subject] || { title: subject, body: message };
  }

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
        // Generate notification text from message placeholders
        const { title, body } = this.generateNotificationText(
          savedMessage.subject,
          savedMessage.message,
          data.actor,
          notificationData?.context,
        );
        
        // Extract deep link data (exclude context) and add message ID
        const { context, ...deepLinkData } = notificationData || {};
        const finalDeepLinkData = {
          ...deepLinkData,
          id: savedMessage.id.toString(),
        };
        
        await this.notificationsService.sendPushNotification(
          receiver.pushToken,
          title,
          body,
          Object.keys(finalDeepLinkData).length > 0 ? finalDeepLinkData : undefined,
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


