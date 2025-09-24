export interface IPreferenceBody {
  amount: number;
  giftId: string;
  productName: string;
  userId: string;
  id?: number;
  environment?: TMercadoPagoEnvironmentType;
}

export type TMercadoPagoEnvironmentType = 'dev' | 'prod';
