import { Injectable, Logger } from '@nestjs/common';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { PushNotificationDto } from '../dto/push-notification.dto';
import { RegisterDeviceDto } from '../dto/register-device.dto';

// Since we don't have a database for device tokens yet, we'll store them in memory
interface DeviceRecord {
  id: string;
  token: string;
  userId?: string;
  deviceInfo?: any;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class PushNotificationService {
  private readonly expo: Expo;
  private readonly logger = new Logger(PushNotificationService.name);
  // In-memory storage for device tokens (replace with database in production)
  private devices: DeviceRecord[] = [];

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
   * Register a device for push notifications
   */
  async registerDevice(registerDeviceDto: RegisterDeviceDto): Promise<DeviceRecord> {
    const { token, userId, deviceInfo } = registerDeviceDto;
    console.log(JSON.stringify(registerDeviceDto));

    // Validate token
    if (!this.isValidExpoPushToken(token)) {
      throw new Error('Invalid Expo push token');
    }

    // Check if this token is already registered
    const existingDeviceIndex = this.devices.findIndex(d => d.token === token);
    
    // Generate a unique ID
    const id = existingDeviceIndex >= 0 
      ? this.devices[existingDeviceIndex].id 
      : `device_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    const now = new Date();
    
    // Create or update the device record
    const deviceRecord: DeviceRecord = {
      id,
      token,
      userId,
      deviceInfo,
      createdAt: existingDeviceIndex >= 0 ? this.devices[existingDeviceIndex].createdAt : now,
      updatedAt: now
    };
    
    // Replace existing or add new
    if (existingDeviceIndex >= 0) {
      this.devices[existingDeviceIndex] = deviceRecord;
      this.logger.log(`Device updated: ${id}`);
    } else {
      this.devices.push(deviceRecord);
      this.logger.log(`New device registered: ${id}`);
    }
    
    return deviceRecord;
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