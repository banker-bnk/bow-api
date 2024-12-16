import { Entity } from 'typeorm';

import { GiftsPayment } from '../../gifts-payments/entities/gifts-payment';

// TODO: this is temporal until confirm the fields
@Entity('payments')
export class Payments extends GiftsPayment {}
