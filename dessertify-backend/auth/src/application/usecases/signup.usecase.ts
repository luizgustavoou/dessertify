import { HashProvider } from '@/domain/contracts/providers/hash-provider.contract';
import { AuthRepository } from '@/domain/contracts/repositories/auth.repository';
import { CustomerEntity } from '@/domain/entities/customer.entity';
import { CustomerCreatedEvent } from '@/domain/events/customer-created.event';
import { SignupParamsDto } from '@/presentation/dtos/signup.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterType } from '@prisma/client';

export abstract class SignupUseCase {
  abstract execute(params: SignupParamsDto): Promise<CustomerEntity>;
}

@Injectable()
export class SignupUseCaseImpl implements SignupUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly amqpConnection: AmqpConnection,
    private readonly hashProvider: HashProvider,
  ) {}

  async execute(params: SignupParamsDto): Promise<CustomerEntity> {
    const customer = await this.authRepository.findOneCustomerByEmail({
      email: params.email,
    });

    if (customer) {
      throw new ConflictException('Customer with this email already exists');
    }

    const hashPassword =
      params.password &&
      (await this.hashProvider.hash({
        content: params.password,
      }));

    const newCustomer = CustomerEntity.create({
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      password: hashPassword,
      registerType: params.type,
    });

    const customerSaved = await this.authRepository.saveCustomer(newCustomer);

    await this.amqpConnection.publish(
      'customers-topic-exchange',
      'customers.created',
      new CustomerCreatedEvent(
        customerSaved.id,
        customerSaved.email,
        customerSaved.firstName,
        customerSaved.lastName,
      ),
    );

    return customerSaved;
  }
}
