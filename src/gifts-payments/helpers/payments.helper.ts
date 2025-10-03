import { APP_SCHEMA, DEFAULT_REDIRECT_SCREEN } from '../../constants';
import { IPreferenceBody } from '../interfaces/preference.interface';

export const preferenceBuilder = (
  preferenceDraft: IPreferenceBody,
  appHostUrl: string,
  id: number,
  external_reference?: any,
  additional_info?: any
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
        user_id: preferenceDraft.userId,
        id,
        environment: preferenceDraft?.environment || 'dev',
      },
      operation_type: 'regular_payment',
      back_urls: {
        success: `${APP_SCHEMA}://${DEFAULT_REDIRECT_SCREEN}/${preferenceDraft?.id}?should_redirect=true`,
        failure: `${APP_SCHEMA}://${DEFAULT_REDIRECT_SCREEN}/${preferenceDraft?.id}?should_redirect=false`,
        pending: `${APP_SCHEMA}://${DEFAULT_REDIRECT_SCREEN}/${preferenceDraft?.id}?should_redirect=true`,
      },
      auto_return: 'approved',
      notification_url: `${appHostUrl}/gifts-payments/save`,
      external_reference,
      additional_info
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

export const getPaymentInfo = (payment: any) => {
  return {
    gift: getGiftInfo(payment),
    user: { userId: payment.metadata.user_id },
    amount: payment.transaction_amount,
    currency: payment.currency_id,
    source: payment.payment_type_id,
    createdAt: new Date(payment.date_created),
    status: payment.status,
  };
};
