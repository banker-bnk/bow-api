import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from '../users/entities/user';
import { NotificationsGateway } from '../gateway/notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(dto: CreateNotificationDto): Promise<Notification> {
    const user = await this.usersRepository.findOne({ where: { id: dto.userId } });
    if (!user) throw new Error('Recipient user not found');

    const actor = dto.actorId
      ? await this.usersRepository.findOne({ where: { id: dto.actorId } })
      : null;

    const notification = this.notificationsRepository.create({
      ...dto,
      user,
      actor,
    });

    const savedNotification = await this.notificationsRepository.save(notification);

    // Emit real-time WebSocket notification
    this.notificationsGateway.sendNotification(dto);

    return savedNotification;
  }

  async findAll(userId: number): Promise<Notification[]> {
    return await this.notificationsRepository.find({
      where: { user: { id: userId } },
      relations: ['actor'],
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: number): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({ where: { id } });
    if (!notification) throw new Error('Notification not found');

    notification.status = 'read';
    return await this.notificationsRepository.save(notification);
  }

  async delete(id: number): Promise<void> {
    await this.notificationsRepository.delete(id);
  }
}