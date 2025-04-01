export interface IPreferenceBody {
  amount: number;
  giftId: string;
  productName: string;
  userId: string;
  message?: string;
  successBackURL?: string;
  failureBackURL?: string;
  pendingBackURL?: string;
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
  amount: number;
  currency: string;
  source: string;
  createdAt: Date | string;
}
