import { CustomerEntity } from '@/domain/entities/customer.entity';
import { CustomerCreatedEvent } from '@/domain/events/customer-created.event';
import { AuthService } from '@/domain/services/auth.service';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { randomUUID } from 'crypto';

export abstract class SignupUseCase {
  abstract execute(
    params: TSignupUseCaseParams,
  ): Promise<TSignupUseCaseResponse>;

  abstract teste(): Promise<void>;
}

export type TSignupUseCaseParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type TSignupUseCaseResponse = CustomerEntity;

@Injectable()
export class SignupUseCaseImpl implements SignupUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async teste(): Promise<void> {
    await this.amqpConnection.publish(
      'customers-topic-exchange',
      'customers.created',
      new CustomerCreatedEvent(randomUUID(), 'john@gmail.com', 'John', 'Doe'),
    );
  }

  async execute(params: TSignupUseCaseParams): Promise<TSignupUseCaseResponse> {
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
