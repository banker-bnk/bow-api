const mockGiftsPaymentsService = {
  findAll: jest.fn(),
  createPreference: jest.fn(),
  savePaymentData: jest.fn(),
  create: jest.fn(),
};

const mockGiftsPaymentsRepository = {
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockUsersRepository = {
  findOne: jest.fn(),
};

const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockImplementation((data) => data),
  sendStatus: jest.fn(),
  send: jest.fn(),
  jsonp: jest.fn(),
} as unknown as Response;

import { Test, TestingModule } from '@nestjs/testing';
import { GiftsPaymentsController } from './gifts-payments.controller';
import { GiftsPaymentsService } from './gifts-payments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GiftsPayment } from './entities/gifts-payment';
import { User } from '../users/entities/user';
import { Response } from 'express';

describe('GiftsPaymentsController', () => {
  let controller: GiftsPaymentsController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GiftsPaymentsController],
      providers: [
        GiftsPaymentsService,
        {
          provide: GiftsPaymentsService,
          useValue: mockGiftsPaymentsService,
        },
        {
          provide: getRepositoryToken(GiftsPayment),
          useValue: mockGiftsPaymentsRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    controller = module.get<GiftsPaymentsController>(GiftsPaymentsController);
  });

  describe('findAll', () => {
    let response;

    describe('when GiftsPaymentsService.findAll success', () => {
      beforeEach(async () => {
        mockGiftsPaymentsService.findAll.mockResolvedValueOnce([{ id: 1 }]);
        response = await controller.findAll();
      });

      test('should call GiftsPaymentsService.findAll', () => {
        expect(mockGiftsPaymentsService.findAll).toHaveBeenCalled();
      });

      test('should return all gifts payments', () => {
        expect(response).toEqual([{ id: 1 }]);
      });
    });

    describe('when GiftsPaymentsService.findAll rejects', () => {
      beforeEach(async () => {
        mockGiftsPaymentsService.findAll.mockRejectedValueOnce(new Error());
        try {
          response = await controller.findAll();
        } catch (error) {
          response = error;
        }
      });

      test('should call GiftsPaymentsService.findAll', () => {
        expect(mockGiftsPaymentsService.findAll).toHaveBeenCalled();
      });

      test('should return an instance of Error', () => {
        expect(response).toBeInstanceOf(Error);
      });
    });
  });

  describe('createPreference', () => {
    let preferenceDto;
    let response;

    beforeAll(() => {
      preferenceDto = { id: 1 };
    });

    describe('when GiftsPaymentsService.createPreference success', () => {
      beforeEach(async () => {
        mockGiftsPaymentsService.createPreference.mockResolvedValueOnce({
          id: 1,
          items: [{ productName: 'productName', amount: 123 }],
        });
        response = await controller.createPreference(preferenceDto);
      });

      test('should call GiftsPaymentsService.createPreference with preferenceDto', () => {
        expect(mockGiftsPaymentsService.createPreference).toHaveBeenCalledWith(
          preferenceDto,
        );
      });

      test('should return a preference', () => {
        expect(response).toEqual({
          id: 1,
          items: [{ productName: 'productName', amount: 123 }],
        });
      });
    });

    describe('when GiftsPaymentsService.createPreference rejects', () => {
      beforeEach(async () => {
        mockGiftsPaymentsService.createPreference.mockRejectedValueOnce(
          new Error(),
        );
        try {
          response = await controller.createPreference(preferenceDto);
        } catch (error) {
          response = error;
        }
      });

      test('should call GiftsPaymentsService.createPreference with preferenceDto', () => {
        expect(mockGiftsPaymentsService.createPreference).toHaveBeenCalledWith(
          preferenceDto,
        );
      });

      test('should return an instance of Error', () => {
        expect(response).toBeInstanceOf(Error);
      });
    });
  });

  describe('save', () => {
    let body;
    let response;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('when GiftsPaymentsService.savePaymentData success', () => {
      describe('when there is payment Id', () => {
        beforeAll(() => {
          body = {
            data: {
              id: 'id',
            },
          };
        });

        beforeEach(async () => {
          mockGiftsPaymentsService.savePaymentData.mockResolvedValueOnce(
            undefined,
          );
          response = await controller.save(body, mockRes);
        });

        test('should call GiftsPaymentsService.savePaymentData with id', () => {
          expect(mockGiftsPaymentsService.savePaymentData).toHaveBeenCalledWith(
            body.data.id,
          );
        });

        test('should return an object with success equal true', () => {
          expect(response).toEqual({ success: true });
        });
      });

      describe('when there is no payment Id', () => {
        beforeAll(() => {
          body = {
            data: {},
          };
        });

        beforeEach(async () => {
          try {
            response = await controller.save(body, mockRes);
          } catch (error) {
            response = error;
          }
        });

        test('should not call GiftsPaymentsService.savePaymentData', () => {
          expect(
            mockGiftsPaymentsService.savePaymentData,
          ).not.toHaveBeenCalled();
        });

        test('should return an object with success equal false', () => {
          expect(response).toEqual({ success: false });
        });
      });
    });

    describe('when GiftsPaymentsService.savePaymentData rejects', () => {
      beforeAll(() => {
        body = {
          data: {
            id: 'id',
          },
        };
      });

      beforeEach(async () => {
        mockGiftsPaymentsService.savePaymentData.mockRejectedValueOnce(
          new Error(),
        );
        try {
          response = await controller.save(body, mockRes);
        } catch (error) {
          response = error;
        }
      });

      test('should call GiftsPaymentsService.savePaymentData with id', () => {
        expect(mockGiftsPaymentsService.savePaymentData).toHaveBeenCalledWith(
          body.data.id,
        );
      });

      test('should return an object with success equal false', () => {
        expect(response).toEqual({ success: false });
      });
    });
  });

  describe('create', () => {
    let response;
    let body;
    let req;

    beforeAll(() => {
      body = {
        amount: 100,
        currency: 'USD',
        source: 'card',
        gift: 1,
      };

      req = {
        user: { sub: 'user-id' },
      };
    });

    describe('when GiftsPaymentsService.create success', () => {
      beforeEach(async () => {
        mockGiftsPaymentsService.create.mockResolvedValueOnce({
          user: req.user,
          ...body,
        });
        response = await controller.create(req, body);
      });

      test('should call GiftsPaymentsService.create with data', () => {
        expect(mockGiftsPaymentsService.create).toHaveBeenCalledWith({
          amount: 100,
          currency: 'USD',
          gift: 1,
          source: 'card',
          user: 'user-id',
        });
      });

      test('should return data', () => {
        expect(response).toEqual({
          amount: 100,
          currency: 'USD',
          gift: 1,
          source: 'card',
          user: 'user-id',
        });
      });
    });

    describe('when GiftsPaymentsService.create rejects', () => {
      beforeEach(async () => {
        mockGiftsPaymentsService.create.mockRejectedValueOnce(new Error());
        try {
          response = await controller.create(req, body);
        } catch (error) {
          response = error;
        }
      });

      test('should call GiftsPaymentsService.create with data', () => {
        expect(mockGiftsPaymentsService.create).toHaveBeenCalledWith({
          amount: 100,
          currency: 'USD',
          gift: 1,
          source: 'card',
          user: 'user-id',
        });
      });

      test('should return an instance of Error', () => {
        expect(response).toBeInstanceOf(Error);
      });
    });
  });
});
