import { CustomerEntity } from '@/domain/entities';

export abstract class CustomersRepository {
  abstract save(props: CustomerEntity): Promise<CustomerEntity>;
  abstract findById(id: string): Promise<CustomerEntity | null>;
  abstract findByEmail(email: string): Promise<CustomerEntity | null>;
  abstract findByAuthCustomerId(authCustomerId: string): Promise<CustomerEntity | null>;
}
