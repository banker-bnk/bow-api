import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
    description: 'Message',
    type: 'string',
    minLength: 1,
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({
    description: 'BACK_URL success',
    type: 'string',
    minLength: 1,
    required: false,
  })
  @IsString()
  @IsOptional()
  successBackURL?: string;

  @ApiProperty({
    description: 'BACK_URL failure',
    type: 'string',
    minLength: 1,
    required: false,
  })
  @IsString()
  @IsOptional()
  failureBackURL?: string;

  @ApiProperty({
    description: 'BACK_URL pending',
    type: 'string',
    minLength: 1,
    required: false,
  })
  @IsString()
  @IsOptional()
  pendingBackURL?: string;

  constructor(partial: Partial<PreferenceDto> = {}) {
    Object.assign(this, partial);
  }
}
