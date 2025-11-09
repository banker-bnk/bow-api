import { APP_SCHEMA, BOW_CONTRIBUTE_TO_MYSELF_PAYMENT_TYPE, DEFAULT_REDIRECT_SCREEN, TBowPaymentType } from '../../constants';
import { IPreferenceBody } from '../interfaces/preference.interface';
import type { PaymentResponse } from '../types/mercado-pago.types';

export const buildRedirectPath = (
  id: number,
  bowPaymentType: TBowPaymentType
) => {
  if (bowPaymentType === BOW_CONTRIBUTE_TO_MYSELF_PAYMENT_TYPE) {
    return `gift/contribute/${id}`;
  }

  return `user/${id}`
};

export const preferenceBuilder = (
  preferenceDraft: IPreferenceBody,
  appHostUrl: string,
  id: number,
) => {
  const redirectPath = buildRedirectPath(preferenceDraft.id, preferenceDraft.bowPaymentType)

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
        bow_payment_type: preferenceDraft.bowPaymentType
      },
      operation_type: 'regular_payment',
      back_urls: {
        success: `${APP_SCHEMA}://${redirectPath}?should_redirect=true`,
        failure: `${APP_SCHEMA}://${redirectPath}?should_redirect=false`,
        pending: `${APP_SCHEMA}://${redirectPath}?should_redirect=true`,
      },
      auto_return: 'approved',
      notification_url: `${appHostUrl}/gifts-payments/save`,
    },
  };
};

export const getGiftInfo = (payment: PaymentResponse) => {
  const { id, title, unit_price } = payment.additional_info.items[0];
  return {
    id,
    title,
    currency: payment.currency_id,
    price: unit_price,
    description: payment?.metadata?.message,
  };
};

export const getFeeDetails = (payment: PaymentResponse) => ({
  paymentFee: payment.fee_details[0].amount,
  netPayment: payment.transaction_details.net_received_amount
})

export const getPaymentInfo = (payment: PaymentResponse) => {
  const feeDetails = getFeeDetails(payment)
  return {
    gift: getGiftInfo(payment),
    user: { userId: payment.metadata.user_id },
    amount: payment.transaction_amount,
    currency: payment.currency_id,
    source: payment.payment_type_id,
    createdAt: new Date(payment.date_created),
    status: payment.status,
    paymentFee: feeDetails.paymentFee,
    netPayment: feeDetails.netPayment,
    bowPaymentType: payment.metadata.bow_payment_type
  };
};
