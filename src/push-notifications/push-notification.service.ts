import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { v4 as uuidv4 } from 'uuid';
import { PushNotificationDto } from './dto/push-notification.dto';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { DeviceToken } from './entities/device-token.entity';
import { User } from '../users/entities/user';

@Injectable()
export class PushNotificationService {
  private readonly expo: Expo;
  private readonly logger = new Logger(PushNotificationService.name);

  constructor(
    @InjectRepository(DeviceToken)
    private readonly deviceTokenRepository: Repository<DeviceToken>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.expo = new Expo();
  }

  /**
   * Registra un dispositivo para recibir notificaciones push
   */
  async registerDevice(registerDeviceDto: RegisterDeviceDto): Promise<DeviceToken> {
    const { token, userId, deviceInfo } = registerDeviceDto;

    // Validar el token
    if (!Expo.isExpoPushToken(token)) {
      throw new Error('Invalid Expo push token');
    }

    // Verificar si el usuario existe
    let user = null;
    if (userId) {
      try {
        user = await this.userRepository.findOne({ where: { id: Number(userId) } });
        if (!user) {
          this.logger.warn(`User with ID ${userId} not found, token will be registered without user association`);
        }
      } catch (error) {
        this.logger.error(`Error finding user with ID ${userId}`, error);
      }
    }

    // Comprobar si el token ya existe
    let deviceToken = await this.deviceTokenRepository.findOne({
      where: { token }
    });

    if (deviceToken) {
      // Actualizar token existente
      deviceToken.userId = user ? Number(userId) : null;
      deviceToken.user = user;
      deviceToken.deviceInfo = deviceInfo;
      deviceToken.isActive = true; // Reactivar si estaba desactivado
      
      this.logger.log(`Device token updated: ${deviceToken.id}`);
      return await this.deviceTokenRepository.save(deviceToken);
    } else {
      // Crear nuevo registro de token
      deviceToken = this.deviceTokenRepository.create({
        token,
        user,
        userId: user ? Number(userId) : null,
        deviceInfo,
        isActive: true
      });
      
      this.logger.log(`New device token registered: ${deviceToken.id}`);
      return await this.deviceTokenRepository.save(deviceToken);
    }
  }

  /**
   * Envía notificaciones push a dispositivos
   */
  async sendPushNotifications(notification: PushNotificationDto): Promise<{
    success: string[];
    failure: string[];
  }> {
    const { tokens, ...rest } = notification;
    
    if (!tokens || tokens.length === 0) {
      this.logger.warn('No tokens provided for push notification');
      return { success: [], failure: [] };
    }
    
    const messages: ExpoPushMessage[] = [];
    const validTokens: string[] = [];
    const invalidTokens: string[] = [];

    // Crear mensajes para cada token válido
    for (const token of tokens) {
      if (!token || !Expo.isExpoPushToken(token)) {
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

    // Si no hay tokens válidos, retornar
    if (messages.length === 0) {
      return { success: [], failure: invalidTokens };
    }

    try {
      // Enviar notificaciones
      const chunks = this.expo.chunkPushNotifications(messages);
      const tickets = [];
      
      for (const chunk of chunks) {
        try {
          const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          this.logger.error('Error sending notifications', error);
        }
      }

      // Procesar resultados
      const successTokens = [];
      const failureTokens = [];
      
      tickets.forEach((ticket, index) => {
        if (index < validTokens.length) {
          if (ticket.status === 'ok') {
            successTokens.push(validTokens[index]);
          } else {
            failureTokens.push(validTokens[index]);
            this.logger.warn(`Failed to send notification to token: ${validTokens[index]}, reason: ${ticket.message || 'unknown'}`);
          }
        }
      });

      return {
        success: successTokens,
        failure: [...invalidTokens, ...failureTokens],
      };
    } catch (error) {
      this.logger.error('Failed to send notifications', error);
      return { success: [], failure: validTokens };
    }
  }
  
  /**
   * Desactiva un token de dispositivo
   */
  async deactivateToken(token: string): Promise<boolean> {
    if (!token) {
      return false;
    }
    
    try {
      const deviceToken = await this.deviceTokenRepository.findOne({ where: { token } });
      if (!deviceToken) {
        return false;
      }
      
      deviceToken.isActive = false;
      await this.deviceTokenRepository.save(deviceToken);
      return true;
    } catch (error) {
      this.logger.error(`Error deactivating token: ${token}`, error);
      return false;
    }
  }
  
  /**
   * Elimina todos los tokens inactivos más antiguos que la fecha proporcionada
   */
  async cleanupInactiveTokens(olderThan: Date): Promise<number> {
    try {
      const result = await this.deviceTokenRepository.delete({
        isActive: false,
        updatedAt: LessThan(olderThan)
      });
      
      return result.affected || 0;
    } catch (error) {
      this.logger.error('Error cleaning up inactive tokens', error);
      return 0;
    }
  }
} 