import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { BOW_CONTRIBUTE_TO_MYSELF_PAYMENT_TYPE, BOW_GIFT_PAYMENT_TYPE, TBowPaymentType } from '../../constants';
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
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({
    description: 'Bow payment type, can be gift or contribute to myself',
    type: 'string',
    required: false,
    enum: [
      BOW_GIFT_PAYMENT_TYPE,
      BOW_CONTRIBUTE_TO_MYSELF_PAYMENT_TYPE
    ]
  })
  @IsString()
  bowPaymentType?: TBowPaymentType = BOW_GIFT_PAYMENT_TYPE;

  constructor(partial: Partial<PreferenceDto> = {}) {
    Object.assign(this, partial);
  }
}
