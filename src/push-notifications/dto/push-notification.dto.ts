import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class PushNotificationDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsArray()
  @IsString({ each: true })
  tokens: string[];

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  sound?: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
} 