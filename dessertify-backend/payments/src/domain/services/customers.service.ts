import { CreateCustomerDto } from '@/presentation/dtos';
import { CustomerEntity, ICustomerProps } from '@/domain/entities';
import { ConflictException, Injectable } from '@nestjs/common';
import { CustomersRepository } from '@/domain/repositories';

export abstract class CustomersService {
  abstract createCustomer(params: CreateCustomerDto): Promise<ICustomerProps>;
}

@Injectable()
export class CustomersServiceImpl implements CustomersService {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async createCustomer(params: CreateCustomerDto): Promise<ICustomerProps> {
    const customer = await this.customersRepository.findByEmail(params.email);

    if (customer) {
      throw new ConflictException('Customer with this email already exists');
    }

    const newCustomer = CustomerEntity.create({
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      authCustomerId: params.authCustomerId,
    });

    const savedCustomer = await this.customersRepository.save(newCustomer);

    return savedCustomer.raw();
  }
}
