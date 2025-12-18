import { Injectable, Logger } from '@nestjs/common';

interface PushNotificationPayload {
  to: string;
  title: string;
  body: string;
  sound?: string;
  priority?: string;
  data?: Record<string, string>;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

  async sendPushNotification(
    pushToken: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<void> {
    if (!pushToken || !pushToken.startsWith('ExponentPushToken[')) {
      this.logger.warn(`Invalid push token: ${pushToken}`);
      return;
    }

    const payload: PushNotificationPayload = {
      to: pushToken,
      title,
      body,
      sound: 'default',
      priority: 'high',
      ...(data && { data }),
    };

    try {
      const response = await fetch(this.EXPO_PUSH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(
          `Failed to send push notification: ${response.status} ${errorText}`,
        );
        return;
      }

      const result = await response.json();
      this.logger.log(`Push notification sent successfully to ${pushToken}`);
      
      if (result.data && result.data[0]?.status === 'error') {
        this.logger.error(
          `Push notification error: ${result.data[0].message}`,
        );
      }
    } catch (error) {
      this.logger.error(`Error sending push notification: ${error.message}`);
    }
  }
}
