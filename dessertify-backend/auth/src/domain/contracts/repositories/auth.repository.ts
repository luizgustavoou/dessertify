import { CustomerEntity } from '@/domain/entities/customer.entity';

export abstract class AuthRepository {
  abstract createCustomer(
    params: ICreateCustomerParams,
  ): Promise<CustomerEntity>;
  abstract findOneCustomerByEmail(
    params: TFindOneCustomerByEmailParams,
  ): Promise<CustomerEntity | null>;
}

export interface ICreateCustomerParams {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export type TFindOneCustomerByEmailParams = {
  email: string;
};