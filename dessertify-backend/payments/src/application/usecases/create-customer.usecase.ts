import { ICustomerProps } from '@/domain/entities';
import { CustomersService } from '@/domain/services';
import { CreateCustomerDto } from '@/presentation/dtos';
import { Injectable } from '@nestjs/common';

export abstract class CreateCustomerUseCase {
  abstract execute(params: CreateCustomerDto): Promise<ICustomerProps>;
}

@Injectable()
export class CreateCustomerUseCaseImpl implements CreateCustomerUseCase {
  constructor(private readonly customersService: CustomersService) {}

  execute(params: CreateCustomerDto): Promise<ICustomerProps> {
    return this.customersService.createCustomer(params);
  }
}
