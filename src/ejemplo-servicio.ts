import { Injectable } from '@nestjs/common';
import { NotificationsService } from './notifications/notifications.service';
import { NotificationType } from './notifications/enums/notification-type.enum';

@Injectable()
export class EjemploServicio {
  constructor(
    private readonly notificationsService: NotificationsService,
    // ... otros servicios que puedas necesitar
  ) {}

  async procesarNuevaAmistad(senderUserId: number, receiverUserId: number): Promise<void> {
    // ... lógica para procesar la solicitud de amistad ...

    // Enviar notificación SIN push notification
    await this.notificationsService.create({
      userId: receiverUserId,
      actorId: senderUserId,
      type: NotificationType.FRIEND_REQUEST,
      message: 'Has recibido una solicitud de amistad',
      entityId: 123, // ID de la solicitud de amistad
      entityType: 'friend_request'
    });
    
    // Enviar notificación CON push notification
    await this.notificationsService.create({
      userId: receiverUserId,
      actorId: senderUserId,
      type: NotificationType.FRIEND_REQUEST,
      message: 'Has recibido una solicitud de amistad',
      entityId: 123, // ID de la solicitud de amistad
      entityType: 'friend_request',
      pushNotification: {
        shouldSendPushNotification: true,
        title: 'Nueva solicitud de amistad',
        body: 'Alguien quiere ser tu amigo',
        sound: 'default',
        data: {
          screen: 'FriendRequests', // Para navegación en la app
          customData: 'cualquier dato adicional'
        }
      }
    });
  }
  
  async procesarRegaloRecibido(
    giftId: number, 
    senderUserId: number, 
    receiverUserId: number, 
    giftName: string
  ): Promise<void> {
    // ... lógica para procesar el regalo ...
    
    // Notificación CON push notification más completa
    await this.notificationsService.create({
      userId: receiverUserId,
      actorId: senderUserId,
      type: NotificationType.GIFT_RECEIVED,
      message: `Has recibido un regalo: ${giftName}`,
      entityId: giftId,
      entityType: 'gift',
      pushNotification: {
        shouldSendPushNotification: true,
        title: '¡Nuevo regalo!',
        body: `Has recibido un regalo: ${giftName}`,
        subtitle: 'Toca para ver detalles',
        sound: 'notification.wav',
        data: {
          screen: 'GiftDetails',
          giftId: giftId,
          giftType: 'physical',
          timestamp: new Date().toISOString()
        }
      }
    });
  }
} 