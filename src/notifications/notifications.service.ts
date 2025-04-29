import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from '../users/entities/user';
import { NotificationsGateway } from '../gateway/notifications.gateway';
import { PushNotificationService } from '../push-notifications/push-notification.service';
import { DeviceToken } from '../push-notifications/entities/device-token.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(DeviceToken)
    private readonly deviceTokenRepository: Repository<DeviceToken>,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly pushNotificationService: PushNotificationService
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

    // Enviar push notification si está habilitado
    if (dto.pushNotification?.shouldSendPushNotification) {
      await this.sendPushNotification(dto);
    }
  
    return savedNotification;
  }

  private async sendPushNotification(dto: CreateNotificationDto): Promise<void> {
    try {
      if (!dto.pushNotification) {
        return; // Salir si no hay configuración de push
      }

      // Verificar que el usuario exista
      const userExists = await this.usersRepository.exists({
        where: { id: dto.userId }
      });
      
      if (!userExists) {
        this.logger.warn(`User with ID ${dto.userId} not found for push notification`);
        return;
      }

      // Obtener tokens activos del usuario
      const deviceTokens = await this.deviceTokenRepository.find({
        where: { 
          userId: dto.userId,
          isActive: true 
        }
      });
      
      if (deviceTokens.length === 0) {
        this.logger.debug(`No device tokens found for user ${dto.userId}`);
        return;
      }
      
      const tokens = deviceTokens.map(dt => dt.token);
      
      // Preparar datos para la notificación push
      const push = dto.pushNotification;
      const title = push.title || 'Nueva notificación';
      const body = push.body || dto.message || 'Tienes una nueva notificación';
      
      // Preparar datos contextuales
      const data = {...(push.data || {})};
      data.notificationType = dto.type;
      if (dto.entityId) data.entityId = dto.entityId;
      if (dto.entityType) data.entityType = dto.entityType;
      if (dto.actorId) data.actorId = dto.actorId;
      
      // Enviar la notificación push
      const result = await this.pushNotificationService.sendPushNotifications({
        title,
        body,
        tokens,
        subtitle: push.subtitle,
        sound: push.sound || 'default',
        data
      });
      
      // Actualizar lastUsed para los tokens exitosos
      if (result.success.length > 0) {
        const now = new Date();
        await Promise.all(
          deviceTokens
            .filter(dt => result.success.includes(dt.token))
            .map(dt => {
              dt.lastUsed = now;
              return this.deviceTokenRepository.save(dt);
            })
        );
      }
      
      // Desactivar tokens fallidos (probablemente inválidos)
      if (result.failure.length > 0) {
        await Promise.all(
          deviceTokens
            .filter(dt => result.failure.includes(dt.token))
            .map(dt => {
              dt.isActive = false;
              return this.deviceTokenRepository.save(dt);
            })
        );
      }
      
      this.logger.log(`Push notification sent: ${result.success.length} successful, ${result.failure.length} failed`);
    } catch (error) {
      this.logger.error('Error sending push notification', error);
      // No lanzamos el error para no interrumpir el flujo principal
    }
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