import { Body, Controller, Post } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';
import { PushNotificationDto } from './dto/push-notification.dto';
import { RegisterDeviceDto } from './dto/register-device.dto';

@Controller()
export class PushNotificationsController {
  constructor(private readonly pushNotificationService: PushNotificationService) {}

  @Post('send-push-notification')
  async sendPushNotification(@Body() notification: PushNotificationDto) {
    const result = await this.pushNotificationService.sendPushNotifications(notification);
    return {
      success: true,
      message: 'Notification sent',
      sent: result.success.length,
      failed: result.failure.length,
      result
    };
  }

  @Post('register-device')
  async registerDevice(@Body() registerDeviceDto: RegisterDeviceDto) {
    const result = await this.pushNotificationService.registerDevice(registerDeviceDto);
    return {
      success: true,
      message: 'Device registered successfully',
      deviceId: result.id
    };
  }
} 