import { CustomerEntity } from '@/domain/entities/customer.entity';
import { CustomerCreatedEvent } from '@/domain/events/customer-created.event';
import { AuthService } from '@/domain/services/auth.service';
import { SignupParamsDto } from '@/presentation/dtos/signup.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

export abstract class SignupUseCase {
  abstract execute(params: SignupParamsDto): Promise<CustomerEntity>;

  abstract teste(): Promise<void>;
}

@Injectable()
export class SignupUseCaseImpl implements SignupUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async teste(): Promise<void> {
    // await this.amqpConnection.publish(
    //   'customers-topic-exchange',
    //   'customers.created',
    //   new CustomerCreatedEvent(randomUUID(), 'john@gmail.com', 'John', 'Doe'),
    // );
  }

  async execute(params: SignupParamsDto): Promise<CustomerEntity> {
    const customer = await this.authService.signup(params);

    await this.amqpConnection.publish(
      'customers-topic-exchange',
      'customers.created',
      new CustomerCreatedEvent(
        customer.id,
        customer.email,
        customer.firstName,
        customer.lastName,
      ),
    );

    return customer;
  }
}
