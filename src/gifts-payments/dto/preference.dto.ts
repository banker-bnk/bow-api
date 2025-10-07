import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
    description: 'Message to the gift receiver',
    type: 'string',
    minLength: 1,
    required: false,
  })
  @IsString()
  message?: string;

  constructor(partial: Partial<PreferenceDto> = {}) {
    Object.assign(this, partial);
  }
}
