import { NotificationType } from '../../notifications/enums/notification-type.enum';
import { APP_SCHEMA } from '../../constants';
import { IGiftInfo, IPaymentInfo, IPreferenceBody } from '../interfaces/preference.interface';

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
        success: `${APP_SCHEMA}://${preferenceDraft.successBackURL}`,
        failure: `${APP_SCHEMA}://${preferenceDraft.failureBackURL}`,
        pending: `${APP_SCHEMA}://${preferenceDraft.pendingBackURL}`,
      },
      auto_return: 'approved',
      notification_url: `${appHostUrl}/gifts-payments/save`,
    },
  };
};

export const getGiftInfo = (payment: any): IGiftInfo => {
  const { id, title, unit_price } = payment.additional_info.items[0];
  return {
    id,
    title,
    currency: payment.currency_id,
    price: unit_price,
    description: payment?.metadata?.message,
  };
};

export const getPaymentInfo = (payment: any): IPaymentInfo => ({
  gift: getGiftInfo(payment),
  user: { userId: payment.metadata.user_id },
  amount: payment.transaction_amount,
  currency: payment.currency_id,
  source: 'Mercado Pago',
  createdAt: new Date(payment.date_created),
});

export const giftPaymentNotificationBuilder = (paymentInfo: IPaymentInfo, paymentStatus: string) => {
  const { user, amount } = paymentInfo;

  const message = paymentStatus === 'approved' ?
    `You have given $${amount}` :
    'Something went wrong. Please try later.'

  const title = paymentStatus === 'approved' ?
    'Successfull operation' :
    'Failed operation'

  return {
    userId: user.userId,
    message,
    type: NotificationType.GIFT_PAYMENT,
    title
  }
};
