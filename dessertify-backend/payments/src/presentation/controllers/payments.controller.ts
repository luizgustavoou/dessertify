import { RabbitPayload, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';
import { CreateChargeDto } from '@/presentation/dtos/create-charge.dto';
import { StripeService } from '@/infra/payments/stripe/stripe.service';
import { CreateCustomerDto } from '@/presentation/dtos/create-customer.dto';
import { CreateCustomerUseCase } from '@/application/usecases';

@Controller()
export class PaymentsController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly createCustomerUseCase: CreateCustomerUseCase,
  ) {}
  @Post()
  testeStripe() {
    return this.stripeService.createPaymentIntent(200);
  }

  @RabbitSubscribe({
    exchange: 'customers-topic-exchange',
    routingKey: 'customers.created',
    queue: 'payments.customer_registration',
  })
  public async customerCreatedEventHandler(
    @RabbitPayload() msg: CreateCustomerDto,
  ) {
    await this.createCustomerUseCase.execute(msg);
  }

  @RabbitSubscribe({
    exchange: 'orders-topic-exchange',
    routingKey: 'orders.created',
    queue: 'payments.order_registration',
  })
  public async orderCreatedEventHandler(@RabbitPayload() msg: CreateChargeDto) {
    console.log('[orderCreatedEventHandler]');
    console.log('Received message: ', msg);
  }
}
