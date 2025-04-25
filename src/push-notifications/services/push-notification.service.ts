import { Injectable, Logger } from '@nestjs/common';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { PushNotificationDto } from '../dto/push-notification.dto';

@Injectable()
export class PushNotificationService {
  private readonly expo: Expo;
  private readonly logger = new Logger(PushNotificationService.name);

  constructor() {
    this.expo = new Expo();
  }

  /**
   * Validate if an Expo token is valid
   */
  private isValidExpoPushToken(token: string): boolean {
    return Expo.isExpoPushToken(token);
  }

  /**
   * Send push notifications to devices
   */
  async sendPushNotifications(notification: PushNotificationDto): Promise<{
    success: string[];
    failure: string[];
  }> {
    const { tokens, ...restNotification } = notification;
    const messages: ExpoPushMessage[] = [];
    const invalidTokens: string[] = [];
    const validTokens: string[] = [];

    // Create messages for each valid token
    for (const token of tokens) {
      if (!this.isValidExpoPushToken(token)) {
        this.logger.warn(`Invalid token: ${token}`);
        invalidTokens.push(token);
        continue;
      }

      validTokens.push(token);
      messages.push({
        to: token,
        sound: notification.sound || 'default',
        title: notification.title,
        body: notification.body,
        subtitle: notification.subtitle,
        data: notification.data || {},
      });
    }

    // If there are no valid tokens, return
    if (messages.length === 0) {
      this.logger.warn('No valid tokens to send notifications');
      return {
        success: [],
        failure: invalidTokens,
      };
    }

    // Group messages in chunks (Expo has a limit per request)
    const chunks = this.expo.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = [];

    try {
      // Send each chunk
      for (const chunk of chunks) {
        try {
          const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          this.logger.error('Error sending notification chunk', error);
        }
      }

      // Process results
      const successTokens: string[] = [];
      const failureTokens: string[] = [];

      tickets.forEach((ticket, index) => {
        if (ticket.status === 'ok') {
          successTokens.push(validTokens[index]);
        } else {
          this.logger.error(`Error sending notification: ${ticket.message}`);
          failureTokens.push(validTokens[index]);
        }
      });

      return {
        success: successTokens,
        failure: [...invalidTokens, ...failureTokens],
      };
    } catch (error) {
      this.logger.error('General error sending notifications', error);
      return {
        success: [],
        failure: validTokens,
      };
    }
  }
} 