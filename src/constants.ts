export const DEFAULT_REDIRECT_SCREEN = 'user'
export const APP_SCHEMA = 'acme';

export enum PAYMENT_STATUS {
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
