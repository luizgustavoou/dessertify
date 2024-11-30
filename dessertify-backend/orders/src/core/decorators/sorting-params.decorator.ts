import {
  ExecutionContext,
  NotAcceptableException,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';

export type SortingParam = {
  property: string;
  direction: string;
}[];

export const SortingParams = createParamDecorator(
  (allowedProperties, ctx: ExecutionContext): SortingParam => {
    const request: Request = ctx.switchToHttp().getRequest();
    const sortQueryParam = request.query.sort as string;

    if (!sortQueryParam) return null;

    // Validate if the allowed properties are provided as an array
    if (!Array.isArray(allowedProperties)) {
      throw new NotAcceptableException('Invalid sort parameter configuration');
    }

    // Split and normalize the sort query parameter into an array
    const sortItems = Array.isArray(sortQueryParam)
      ? sortQueryParam
      : [sortQueryParam];

    const validSortPattern = /^([a-zA-Z0-9]+):(asc|desc)$/;

    for (const sortItem of sortItems) {
      if (!validSortPattern.test(sortItem)) {
        throw new NotAcceptableException(
          'Invalid sort parameter format. Expected format: property:asc|desc',
        );
      }
    }

    for (const sortItem of sortItems) {
      // Extract property and direction, and validate against allowed properties
      const [property, direction] = sortItem.split(':');

      if (!allowedProperties.includes(property)) {
        throw new NotAcceptableException(
          `Invalid sort property: "${property}". Allowed properties: [${allowedProperties.join(', ')}]`,
        );
      }
    }

    // Transform and return the validated sorting parameters
    return sortItems.map((sortItem) => {
      const [property, direction] = sortItem.split(':');

      return {
        property,
        direction,
      };
    });
  },
);
