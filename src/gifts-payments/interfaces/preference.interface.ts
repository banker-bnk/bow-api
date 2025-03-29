export interface IPreferenceBody {
  amount: number;
  giftId: string;
  productName: string;
  userId: string;
  message?: string;
  id?: number;
}

export interface IGiftInfo {
  id: number;
  title: string;
  currency: string;
  price: string | number;
  description: string;
}

export interface IPaymentInfo {
  gift: IGiftInfo,
  user: any;
  amount: number | string;
  currency: number | string;
  source: string;
  createdAt: Date | string;
}
