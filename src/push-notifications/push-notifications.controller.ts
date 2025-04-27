import { Body, Controller, Post } from '@nestjs/common';
import { PushNotificationService } from './services/push-notification.service';
import { PushNotificationDto } from './dto/push-notification.dto';
import { RegisterDeviceDto } from './dto/register-device.dto';

@Controller()
export class PushNotificationsController {
  constructor(private readonly pushNotificationService: PushNotificationService) {}

  @Post('push-notifications/send')
  async sendPushNotifications(@Body() notification: PushNotificationDto) {
    const result = await this.pushNotificationService.sendPushNotifications(notification);
    return {
      success: true,
      message: 'Notifications processed',
      sent: result.success.length,
      failed: result.failure.length,
      result
    };
  }

  @Post('send-push-notification')
  async sendSinglePushNotification(@Body() notification: PushNotificationDto) {
    const result = await this.pushNotificationService.sendPushNotifications(notification);
    return {
      success: true,
      message: 'Notification sent',
      sent: result.success.length,
      failed: result.failure.length,
      result
    };
  }

  @Post('push-notifications/register-device')
  async registerDevice(@Body() registerDeviceDto: RegisterDeviceDto) {
    const result = await this.pushNotificationService.registerDevice(registerDeviceDto);
    return {
      success: true,
      message: 'Device registered successfully',
      deviceId: result.id
    };
  }
} 