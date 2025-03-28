import { APP_SCHEMA, backUrlEnum } from '../../constants';
import { IPreferenceBody } from '../interfaces/preference.interface';

export const preferenceBuilder = (
  preferenceDraft: IPreferenceBody,
  appHostUrl: string,
) => {
  return {
    body: {
      items: [
        {
          id: preferenceDraft.giftId,
          unit_price: preferenceDraft.amount,
          quantity: 1,
          title: preferenceDraft.productName,
        },
      ],
      metadata: {
        message: preferenceDraft?.message,
        user_id: preferenceDraft.userId,
      },
      operation_type: 'regular_payment',
      back_urls: {
        success: `${APP_SCHEMA}://${backUrlEnum.SUCCESS}/${preferenceDraft?.id}`,
        failure: `${APP_SCHEMA}://${backUrlEnum.FAILURE}/${preferenceDraft?.id}`,
        pending: `${APP_SCHEMA}://${backUrlEnum.PENDING}/${preferenceDraft?.id}`,
      },
      auto_return: 'approved',
      notification_url: `${appHostUrl}/gifts-payments/save`,
    },
  };
};

export const getGiftInfo = (payment: any) => {
  const { id, title, unit_price } = payment.additional_info.items[0];
  return {
    id,
    title,
    currency: payment.currency_id,
    price: unit_price,
    description: payment?.metadata?.message,
  };
};

export const getPaymentInfo = (payment: any) => ({
  gift: getGiftInfo(payment),
  user: { userId: payment.metadata.user_id },
  amount: payment.transaction_amount,
  currency: payment.currency_id,
  source: 'Mercado Pago',
  createdAt: new Date(payment.date_created),
});
