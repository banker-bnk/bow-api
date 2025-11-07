import { TBowPaymentType } from "../../constants";

export interface IPreferenceBody {
  amount: number;
  giftId: string;
  productName: string;
  userId: string;
  id?: number;
  bowPaymentType?: TBowPaymentType;
}
