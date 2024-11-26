import { DomainError } from '@/domain/errors/domain.error';

export class NotFoundError extends DomainError {
  constructor(entity: string, id: string) {
    super(`${entity} with ID ${id} was not found.`);
  }
}
