import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { NotificationType } from '../enums/notification-type.enum';

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
}