import { Message } from '../entities/message';

export interface NotificationData {
  screen?: string;
  id?: string;
  // Context data for generating notification text
  context?: {
    amount?: string;
    [key: string]: any;
  };
}

export interface CreateMessageWithNotification extends Partial<Message> {
  notificationData?: NotificationData;
}

