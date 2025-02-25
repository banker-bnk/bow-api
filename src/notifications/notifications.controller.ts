import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return await this.notificationsService.create(createNotificationDto);
  }

  @Get(':userId')
  async findAll(@Param('userId') userId: number) {
    return await this.notificationsService.findAll(userId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: number) {
    return await this.notificationsService.markAsRead(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.notificationsService.delete(id);
    return { message: 'Notification deleted successfully' };
  }
}