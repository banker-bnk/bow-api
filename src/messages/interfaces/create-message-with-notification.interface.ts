import { Message } from '../entities/message';

export interface NotificationData {
  screen?: string;
  id?: string;
  [key: string]: any; // Allow additional custom data
}

export interface CreateMessageWithNotification extends Partial<Message> {
  notificationData?: NotificationData;
}

