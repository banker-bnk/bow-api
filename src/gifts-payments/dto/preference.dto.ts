import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TMercadoPagoEnvironmentType } from '../interfaces/preference.interface';

export class PreferenceDto {
  @ApiProperty({
    description: 'Amount',
    type: 'number',
    minLength: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Gift Id',
    type: 'string',
    minLength: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  giftId: string;

  @ApiProperty({
    description: 'Product Name',
    type: 'string',
    minLength: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  productName: string;

  @ApiProperty({
    description: 'User Id',
    type: 'string',
    minLength: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'user ID from database',
    type: 'number',
    minLength: 1,
    required: true,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'environment (temporal variable)',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  environment?: TMercadoPagoEnvironmentType;

  constructor(partial: Partial<PreferenceDto> = {}) {
    Object.assign(this, partial);
  }
}
