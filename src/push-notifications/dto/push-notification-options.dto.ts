import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

/**
 * DTO para opciones específicas de notificaciones push
 */
export class PushNotificationOptionsDto {
  @IsOptional()
  @IsBoolean()
  shouldSendPushNotification = false; // Por defecto, no se envía push notification

  @IsOptional()
  @IsString()
  title?: string; // Título específico para la push notification

  @IsOptional()
  @IsString()
  body?: string; // Cuerpo del mensaje para la push notification
  
  @IsOptional()
  @IsString()
  subtitle?: string;
  
  @IsOptional()
  @IsString()
  sound?: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>; // Datos adicionales para la push notification
} 