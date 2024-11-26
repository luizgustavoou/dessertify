import { DomainError } from '@/domain/errors/domain.error';

export class OrderMustHaveAtLeastOneItemError extends DomainError {
  constructor() {
    super('Order must have at least one item');
  }
}
