export interface IPreferenceBody {
  amount: number;
  giftId: string;
  productName: string;
  userId: string;
  message?: string;
}

export interface IUser {
  userId: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  image?: string;
  birthday?: Date;
  lastSeen?: Date;
}

export interface IGift {
  id: number;
  title?: string;
  description?: string;
  link?: string;
  price?: number;
  currency?: string;
  endDate?: Date;
  image?: string;
  user?: IUser;
  createdAt?: Date;
}

export interface IPaymentInfo {
  gift: IGift;
  user: IUser;
  amount: number;
  currency: string;
  source: string;
  createdAt: Date;
}
