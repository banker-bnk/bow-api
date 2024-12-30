const APP_SCHEMA = 'APP_SCHEMA';
const backUrlEnum = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  PENDING: 'PENDING',
};
jest.mock('../../constants', () => ({
  APP_SCHEMA,
  backUrlEnum,
}));

import * as paymentsHelper from './payments.helper';

describe('Payments Helper', () => {
  describe('preferenceBuilder', () => {
    let appHostUrl;
    let preferenceDraft;
    let result;

    beforeAll(() => {
      appHostUrl = 'appHostUrl';
      preferenceDraft = {
        amount: 123,
        giftId: 'giftId',
        productName: 'productName',
        userId: 'userId',
        message: 'message',
      };
    });

    beforeEach(() => {
      result = paymentsHelper.preferenceBuilder(preferenceDraft, appHostUrl);
    });

    test('should return a preference object', () => {
      expect(result).toEqual({
        body: {
          auto_return: 'approved',
          back_urls: {
            failure: 'APP_SCHEMA://FAILURE',
            pending: 'APP_SCHEMA://PENDING',
            success: 'APP_SCHEMA://SUCCESS',
          },
          items: [
            {
              id: 'giftId',
              quantity: 1,
              title: 'productName',
              unit_price: 123,
            },
          ],
          metadata: { message: 'message', user_id: 'userId' },
          notification_url: 'appHostUrl/gifts-payments/save',
          operation_type: 'regular_payment',
        },
      });
    });
  });

  describe('getGiftInfo', () => {
    let payment;
    let result;

    beforeAll(() => {
      payment = {
        additional_info: {
          items: [
            {
              id: 'id',
              title: 'title',
              unit_price: 123,
            },
          ],
        },
        currency_id: 'ARS',
        metadata: {
          message: 'message',
        },
      };
    });

    beforeEach(() => {
      result = paymentsHelper.getGiftInfo(payment);
    });

    test('should return a gift info object', () => {
      expect(result).toEqual({
        currency: 'ARS',
        description: 'message',
        id: 'id',
        price: 123,
        title: 'title',
      });
    });
  });

  describe('getPaymentInfo', () => {
    let mockGetGiftInfo;
    let payment;
    let result;

    beforeAll(() => {
      mockGetGiftInfo = jest.spyOn(paymentsHelper, 'getGiftInfo');
      payment = {
        transaction_amount: 123,
        currency_id: 'ARS',
        date_created: '2024-12-14T03:00:00.000Z',
        metadata: {
          user_id: 'userId',
        },
      };
    });

    beforeEach(() => {
      mockGetGiftInfo.mockReturnValueOnce({
        currency: 'ARS',
        description: 'message',
        id: 'id',
        price: 123,
        title: 'title',
      });
      result = paymentsHelper.getPaymentInfo(payment);
    });

    test('should return a payment info object', () => {
      expect(result).toEqual({
        amount: 123,
        createdAt: new Date('2024-12-14T03:00:00.000Z'),
        currency: 'ARS',
        gift: {
          currency: 'ARS',
          description: 'message',
          id: 'id',
          price: 123,
          title: 'title',
        },
        source: 'Mercado Pago',
        user: { userId: 'userId' },
      });
    });
  });
});
