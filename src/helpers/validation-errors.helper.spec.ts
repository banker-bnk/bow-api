import { BadRequestException, HttpStatus } from '@nestjs/common';

import {
  flattenValidationErrors,
  formatValidationErrors,
} from './validation-errors.helper';
import * as validationErrorsHelper from './validation-errors.helper';

describe('Validation Errors helper', () => {
  describe('flattenValidationErrors', () => {
    let errors;
    let result;

    beforeAll(() => {
      errors = [
        {
          property: 'shippingAddress',
          children: [
            {
              property: 'phone',
              children: [],
              constraints: {
                customValidation: 'phone should be a valid phone number',
                isNumberString: 'phone must be a number string',
              },
            },
            {
              property: 'state',
              children: [],
              constraints: {
                customValidation: 'state invalid state',
              },
            },
            {
              property: 'promotabilityOptions',
              children: [
                {
                  property: 'sourceCode',
                  children: [],
                  constraints: {
                    isNotEmpty: 'sourceCode should not be empty',
                  },
                },
              ],
            },
          ],
        },
      ];
    });

    beforeEach(() => {
      result = flattenValidationErrors(errors);
    });

    test('should return an array of objects containing invalidProperty and messages', () => {
      expect(result).toEqual([
        {
          invalidProperty: 'shippingAddress.phone',
          messages: [
            'shippingAddress.phone should be a valid phone number',
            'shippingAddress.phone must be a number string',
          ],
        },
        {
          invalidProperty: 'shippingAddress.state',
          messages: ['shippingAddress.state invalid state'],
        },
        {
          invalidProperty: 'shippingAddress.promotabilityOptions.sourceCode',
          messages: [
            'shippingAddress.promotabilityOptions.sourceCode should not be empty',
          ],
        },
      ]);
    });
  });

  describe('formatValidationErrors', () => {
    let errors;
    let mockFlattenValidationErrors;
    let result;

    beforeAll(() => {
      errors = [
        {
          property: 'shippingAddress',
          children: [
            {
              property: 'phone',
              children: [],
              constraints: {
                customValidation: 'phone should be a valid phone number',
                isNumberString: 'phone must be a number string',
              },
            },
            {
              property: 'state',
              children: [],
              constraints: {
                customValidation: 'state invalid state',
              },
            },
            {
              property: 'promotabilityOptions',
              children: [
                {
                  property: 'sourceCode',
                  children: [],
                  constraints: {
                    isNotEmpty: 'sourceCode should not be empty',
                  },
                },
              ],
            },
          ],
        },
      ];
    });

    beforeEach(() => {
      mockFlattenValidationErrors = jest
        .spyOn(validationErrorsHelper, 'flattenValidationErrors')
        .mockReturnValueOnce([
          {
            invalidProperty: 'shippingAddress.phone',
            messages: [
              'shippingAddress.phone should be a valid phone number',
              'shippingAddress.phone must be a number string',
            ],
          },
          {
            invalidProperty: 'shippingAddress.state',
            messages: ['shippingAddress.state invalid state'],
          },
          {
            invalidProperty: 'shippingAddress.promotabilityOptions.sourceCode',
            messages: [
              'shippingAddress.promotabilityOptions.sourceCode should not be empty',
            ],
          },
        ]);
      try {
        result = formatValidationErrors(errors);
      } catch (error) {
        result = error;
      }
    });

    test('should call flattenValidationErrors with errors', () => {
      expect(mockFlattenValidationErrors).toHaveBeenCalledWith(errors);
    });

    test('should throw a BadRequestException with VALIDATION_ERROR error code, invalidProperties as an array of properties names and message', () => {
      expect(result).toEqual(
        new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          code: 'VALIDATION_ERROR',
          invalidProperties: [
            'shippingAddress.phone',
            'shippingAddress.state',
            'shippingAddress.promotabilityOptions.sourceCode',
          ],
          message: [
            'shippingAddress.phone should be a valid phone number',
            'shippingAddress.phone must be a number string',
            'shippingAddress.state invalid state',
            'shippingAddress.promotabilityOptions.sourceCode should not be empty',
          ],
        }),
      );
    });
  });
});
