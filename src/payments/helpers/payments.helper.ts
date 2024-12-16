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
        success: `${APP_SCHEMA}://${backUrlEnum.SUCCESS}`,
        failure: `${APP_SCHEMA}://${backUrlEnum.FAILURE}`,
        pending: `${APP_SCHEMA}://${backUrlEnum.PENDING}`,
      },
      auto_return: 'approved',
      notification_url: `${appHostUrl}/payments/payment-data`,
    },
  };
};

export const getPaymentInfo = (payment) => {
  const { payer, additional_info, currency_id, metadata, date_created } =
    payment;
  const { id: gift_id, unit_price } = additional_info.items[0];
  return {
    id: payer.id,
    gift_id,
    user_id: metadata.user_id,
    amount: unit_price,
    currency: currency_id,
    created_at: date_created,
  };
};
