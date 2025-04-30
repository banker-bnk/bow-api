import { IsEnum, IsInt, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationType } from '../enums/notification-type.enum';
import { PushNotificationOptionsDto } from '../../push-notifications/dto/push-notification-options.dto';

export class CreateNotificationDto {
  @IsInt()
  userId: number;

  @IsOptional()
  @IsInt()
  actorId?: number;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsOptional()
  @IsInt()
  entityId?: number;

  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsString()
  message?: string;
  
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PushNotificationOptionsDto)
  pushNotification?: PushNotificationOptionsDto;
}