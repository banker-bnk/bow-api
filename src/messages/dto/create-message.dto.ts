import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { MessageType } from '../enums/message-type.enum';

export class CreateMessageDto {
  @IsInt()
  userId: number;

  @IsOptional()
  @IsInt()
  actorId?: number;

  @IsEnum(MessageType)
  type: MessageType;

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