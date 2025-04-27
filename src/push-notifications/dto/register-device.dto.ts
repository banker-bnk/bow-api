import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class RegisterDeviceDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsObject()
  deviceInfo?: {
    platform: string;
    model?: string;
    osVersion?: string;
  };
} 