import {
  CustomerEntity,
  ICustomerProps,
} from '@/domain/entities/customer.entity';

export abstract class AuthRepository {
  abstract saveCustomer(params: CustomerEntity): Promise<CustomerEntity>;
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
