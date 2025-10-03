export const DEFAULT_REDIRECT_SCREEN = 'user'
export const APP_SCHEMA = 'acme';

export enum PAYMENT_STATUS {
  INIT = 'init',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING = 'pending',
  AUTHORIZED = 'authorized',
  IN_PROCESS = 'in_process',
  IN_MEDIATION = 'in_mediation',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  CHARGED_BACK = 'charged_back'
}

export enum SHIPPING_STATUS {
  NOT_SHIPPED = 'not_shipped',
  PREPARING = 'preparing',
  SHIPPED = 'shipped',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  FAILED_DELIVERY = 'failed_delivery',
  RETURNED = 'returned'
}
