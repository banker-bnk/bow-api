const mockPreferenceBuilder = jest.fn();
const mockGetPaymentInfo = jest.fn();
jest.mock('./helpers/payments.helper', () => ({
  preferenceBuilder: mockPreferenceBuilder,
  getPaymentInfo: mockGetPaymentInfo,
}));

const mockGiftsPaymentsRepository = {
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockUsersRepository = {
  findOne: jest.fn(),
};

const mockMessagesService = {
  create: jest.fn(),
};

const mockPreference = {
  create: jest.fn(),
};
const mockPayment = {
  get: jest.fn(),
};
const mockMercadoPagoConfig = {};
jest.mock('mercadopago', () => ({
  MercadoPagoConfig: jest.fn().mockImplementation(() => mockMercadoPagoConfig),
  Preference: jest.fn().mockImplementation(() => mockPreference),
  Payment: jest.fn().mockImplementation(() => mockPayment),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { GiftsPaymentsService } from './gifts-payments.service';
import { GiftsPayment } from './entities/gifts-payment';
import { User } from '../users/entities/user';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MessagesService } from '../messages/messages.service';

describe('GiftsPaymentsService', () => {
  let service: GiftsPaymentsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GiftsPaymentsService,
        {
          provide: getRepositoryToken(GiftsPayment),
          useValue: mockGiftsPaymentsRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: MessagesService,
          useValue: mockMessagesService,
        },
      ],
    }).compile();

    service = module.get<GiftsPaymentsService>(GiftsPaymentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    let response;
    const mockData = [
      {
        id: 1,
        amount: 100,
        currency: 'USD',
        source: 'Test',
        createdAt: '2024-12-14T03:00:00.000Z',
        user: { id: 1, name: 'Test User' },
        gift: { id: 1, name: 'Test Gift' },
      },
    ];

    describe('when GiftsPaymentsRepository.find success', () => {
      beforeEach(async () => {
        mockGiftsPaymentsRepository.find.mockResolvedValueOnce(mockData);
        response = await service.findAll('user123');
      });

      test('should call GiftsPaymentsRepository.find', () => {
        expect(mockGiftsPaymentsRepository.find).toHaveBeenCalled();
      });

      test('should return an array of gifts payments', () => {
        expect(response).toEqual(mockData);
      });
    });

    describe('when GiftsPaymentsRepository.find rejects', () => {
      beforeEach(async () => {
        mockGiftsPaymentsRepository.find.mockRejectedValueOnce(new Error());
        try {
          response = await service.findAll('user123');
        } catch (error) {
          response = error;
        }
      });

      test('should call GiftsPaymentsRepository.find', () => {
        expect(mockGiftsPaymentsRepository.find).toHaveBeenCalled();
      });

      test('should return an instance of Error', () => {
        expect(response).toBeInstanceOf(Error);
      });
    });
  });

  describe('createPreference', () => {
    let mockPreferenceDto;
    let mockPreferenceData;
    let response;

    beforeAll(() => {
      mockPreferenceDto = {
        amount: 123,
        giftId: 'giftId',
        productName: 'productName',
        userId: 'userId',
        message: 'message',
      };
      mockPreferenceData = {
        body: {
          items: [
            {
              id: 'id',
              unit_price: '123',
              quantity: 1,
              title: 'productName',
            },
          ],
          metadata: {
            message: 'message',
            user_id: 'userId',
          },
          operation_type: 'regular_payment',
          back_urls: {
            success: 'success',
            failure: 'failure',
            pending: 'pending',
          },
          auto_return: 'approved',
          notification_url: 'appHostUrl/gifts-payments/payment-data',
        },
      };
    });

    describe('when MercadoPago Preference success', () => {
      beforeEach(async () => {
        mockPreferenceBuilder.mockReturnValueOnce(mockPreferenceData);
        mockPreference.create.mockResolvedValueOnce(mockPreferenceData);
        response = await service.createPreference(mockPreferenceDto);
      });

      test('should call preferenceBuilder with preferenceDto and APP_HOST_URL', () => {
        expect(mockPreferenceBuilder).toHaveBeenCalledWith(
          mockPreferenceDto,
          undefined,
        );
      });

      test('should call Preference.create with preferenceData', () => {
        expect(mockPreference.create).toHaveBeenCalledTimes(1);
        expect(mockPreference.create).toHaveBeenCalledWith(mockPreferenceData);
      });

      test('should return created preference from Mercado Pago', () => {
        expect(response).toEqual(mockPreferenceData);
      });
    });

    describe('when MercadoPago Preference rejects', () => {
      beforeEach(async () => {
        mockPreferenceBuilder.mockReturnValueOnce(mockPreferenceData);
        mockPreference.create.mockRejectedValueOnce(new Error());
        try {
          response = await service.createPreference(mockPreferenceDto);
        } catch (error) {
          response = error;
        }
      });

      test('should call preferenceBuilder with preferenceDto and APP_HOST_URL', () => {
        expect(mockPreferenceBuilder).toHaveBeenCalledWith(
          mockPreferenceDto,
          undefined,
        );
      });

      test('should call Preference.create with preferenceData', () => {
        expect(mockPreference.create).toHaveBeenCalledTimes(1);
        expect(mockPreference.create).toHaveBeenCalledWith(mockPreferenceData);
      });

      test('should return an instance of Error', () => {
        expect(response).toBeInstanceOf(Error);
      });
    });
  });

  describe('create', () => {
    let data;
    let updatedData;
    let mockUser;
    let response;

    beforeAll(() => {
      data = {
        amount: 100,
        user: { userId: 'userId' },
      };
      mockUser = {
        userId: 'userId',
        name: 'Test User',
      };
      updatedData = {
        amount: 100,
        user: { userId: 'userId', name: 'Test User' },
      };
    });

    describe('when UsersRepository.find finds user', () => {
      beforeEach(async () => {
        mockUsersRepository.findOne.mockResolvedValueOnce(mockUser);
        mockGiftsPaymentsRepository.create.mockResolvedValueOnce(updatedData);
        mockGiftsPaymentsRepository.save.mockResolvedValueOnce(updatedData);
        response = await service.create(data);
      });

      test('should call UsersRepository.findOne with query', () => {
        expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
          where: { userId: data.user.userId },
        });
      });

      test('should call GiftsPaymentsRepository.create with updated data', () => {
        expect(mockGiftsPaymentsRepository.create).toHaveBeenCalledWith(
          updatedData,
        );
      });

      test('should call GiftsPaymentsRepository.save with updated data', () => {
        expect(mockGiftsPaymentsRepository.create).toHaveBeenCalledWith(
          updatedData,
        );
      });

      test('should return updated data', () => {
        expect(response).toEqual(updatedData);
      });
    });

    describe('when UsersRepository.find does not find user', () => {
      beforeEach(async () => {
        mockUsersRepository.findOne.mockResolvedValueOnce(undefined);
        try {
          response = await service.create(data);
        } catch (error) {
          response = error;
        }
      });

      test('should call UsersRepository.findOne with query', () => {
        expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
          where: { userId: data.user.userId },
        });
      });

      test('should not call GiftsPaymentsRepository.create', () => {
        expect(mockGiftsPaymentsRepository.create).not.toHaveBeenCalled();
      });

      test('should not call GiftsPaymentsRepository.save', () => {
        expect(mockGiftsPaymentsRepository.create).not.toHaveBeenCalled();
      });

      test('should return an instance of Error', () => {
        expect(response).toBeInstanceOf(Error);
      });
    });
  });

  describe('savePaymentData', () => {
    let mockPaymentId;
    let mockPaymentResponse;
    let mockPaymentInfo;
    let mockCreate;
    let response;

    beforeAll(() => {
      mockCreate = jest.spyOn(service, 'create');
      mockPaymentId = 'paymentId';
      mockPaymentInfo = {
        amount: 100,
        user: { userId: 'test-user-id' },
      };
    });

    describe('when Mercado Pago Payment.get success', () => {
      describe('when payment.status is equal to approved', () => {
        beforeAll(() => {
          mockPaymentResponse = {
            status: 'approved',
            transaction_amount: 100,
          };
        });

        beforeEach(async () => {
          mockPayment.get.mockResolvedValueOnce(mockPaymentResponse);
          mockGetPaymentInfo.mockReturnValueOnce(mockPaymentInfo);
          mockCreate.mockResolvedValueOnce({
            id: 1,
            amount: 100,
            user: { userId: 'test-user-id' },
          });
          response = await service.savePaymentData(mockPaymentId);
        });

        test('should call Mercado Pagon Payment.get with paymentId', () => {
          expect(mockPayment.get).toHaveBeenCalledWith({ id: mockPaymentId });
        });

        test('should call getPaymentInfo with payment response', () => {
          expect(mockGetPaymentInfo).toHaveBeenCalledWith(mockPaymentResponse);
        });

        test('should call GiftsPaymentsService.create with payment info', () => {
          expect(mockCreate).toHaveBeenCalledWith(mockPaymentInfo);
        });

        test('should return undefined', () => {
          expect(response).toBeUndefined();
        });
      });

      describe('when payment.status is different than approved', () => {
        beforeAll(() => {
          mockPaymentResponse = {
            status: 'rejected',
            transaction_amount: 100,
          };
        });

        beforeEach(async () => {
          mockPayment.get.mockResolvedValueOnce(mockPaymentResponse);
          mockGetPaymentInfo.mockReturnValueOnce(mockPaymentInfo);
          mockCreate.mockResolvedValueOnce({
            id: 1,
            amount: 100,
            user: { userId: 'test-user-id' },
          });
          response = await service.savePaymentData(mockPaymentId);
        });

        test('should call Mercado Pagon Payment.get with paymentId', () => {
          expect(mockPayment.get).toHaveBeenCalledWith({ id: mockPaymentId });
        });

        test('should not call getPaymentInfo', () => {
          expect(mockGetPaymentInfo).not.toHaveBeenCalled();
        });

        test('should not call GiftsPaymentsService.create', () => {
          expect(mockCreate).not.toHaveBeenCalled();
        });

        test('should return undefined', () => {
          expect(response).toBeUndefined();
        });
      });
    });

    describe('when Mercado Pago Payment.get rejects', () => {
      beforeEach(async () => {
        mockPayment.get.mockRejectedValueOnce(new Error());
        mockGetPaymentInfo.mockReturnValueOnce(mockPaymentInfo);
        mockCreate.mockResolvedValueOnce({
          id: 1,
          amount: 100,
          user: { userId: 'test-user-id' },
        });
        try {
          response = await service.savePaymentData(mockPaymentId);
        } catch (error) {
          response = error;
        }
      });

      test('should call Mercado Pagon Payment.get with paymentId', () => {
        expect(mockPayment.get).toHaveBeenCalledWith({ id: mockPaymentId });
      });

      test('should not call getPaymentInfo', () => {
        expect(mockGetPaymentInfo).not.toHaveBeenCalled();
      });

      test('should not call GiftsPaymentsService.create', () => {
        expect(mockCreate).not.toHaveBeenCalled();
      });

      test('should return an instance of Error', () => {
        expect(response).toBeInstanceOf(Error);
      });
    });
  });
});
