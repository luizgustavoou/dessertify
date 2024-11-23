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
    // @Inject('CUSTOMERS_SERVICE')
    // private readonly customersServiced: ClientProxy,
  ) {}

  async teste(): Promise<void> {
    // await this.customersServiced.emit(
    //   'customer_created',
    //   new CustomerCreatedEvent(
    //     randomUUID(),
    //     'luiz@gmail.com',
    //     'luiz',
    //     'umbelino',
    //   ),
    // );

    console.log('envaindo...');
    
    this.amqpConnection.publish(
      'customers-topic-exchange',
      'customers.created',
      { msg: 'hello-world!' },
    );
  }

  async execute(params: TSignupUseCaseParams): Promise<TSignupUseCaseResponse> {
    const customer = await this.authService.signup(params);

    // await this.customersServiced.emit(
    //   'customer_created',
    //   new CustomerCreatedEvent(
    //     customer.id,
    //     customer.email,
    //     customer.firstName,
    //     customer.lastName,
    //   ),
    // );

    return customer;
  }
}
