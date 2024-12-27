import {
  BadRequestException,
  HttpStatus,
  ValidationError,
} from '@nestjs/common';

export const flattenValidationErrors = (
  errors: ValidationError[],
  parentProperty = '',
): { invalidProperty: string; messages: string[] }[] => {
  let response = [];

  errors.forEach((error) => {
    const currentProperty = parentProperty
      ? `${parentProperty}.${error.property}`
      : error.property;
    const messages = error.constraints
      ? Object.values(error.constraints).map(
          (message) =>
            `${
              parentProperty ? `${parentProperty}.` : parentProperty
            }${message}`,
        )
      : [];

    if (error.children.length) {
      response = [
        ...response,
        ...flattenValidationErrors(error.children, currentProperty),
      ];
    } else {
      response = [...response, { invalidProperty: currentProperty, messages }];
    }
  });

  return response;
};

export const formatValidationErrors = (
  errors: ValidationError[],
): BadRequestException => {
  const flattenedValidationErrors = flattenValidationErrors(errors);
  throw new BadRequestException({
    statusCode: HttpStatus.BAD_REQUEST,
    code: 'VALIDATION_ERROR',
    invalidProperties: flattenedValidationErrors.map(
      ({ invalidProperty }) => invalidProperty,
    ),
    message: flattenedValidationErrors.map(({ messages }) => messages).flat(),
  });
};
