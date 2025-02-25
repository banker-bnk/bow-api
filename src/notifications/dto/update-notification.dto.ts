import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateNotificationDto {
  @IsOptional()
  @IsEnum(['unread', 'read', 'dismissed'])
  status?: 'unread' | 'read' | 'dismissed';
}