import { ICustomerProps } from '@/domain/entities';
import { CustomersService } from '@/domain/services';
import { StripeService } from '@/infra/payments/stripe/stripe.service';
import { CreateCustomerDto } from '@/presentation/dtos';
import { Injectable } from '@nestjs/common';

export abstract class CreateCustomerUseCase {
  abstract execute(params: CreateCustomerDto): Promise<ICustomerProps>;
}

@Injectable()
export class CreateCustomerUseCaseImpl implements CreateCustomerUseCase {
  constructor(
    private readonly customersService: CustomersService,
    private readonly stripeService: StripeService,
  ) {}

  async execute(params: CreateCustomerDto): Promise<ICustomerProps> {
    const customer = await this.customersService.createCustomer(params);

    await this.stripeService.createCustomer({
      id: customer.id,
      email: customer.email,
      name: `${customer.firstName} ${customer.lastName}`,
    });

    return customer;
  }
}
