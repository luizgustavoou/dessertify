import {
  AmqpConnection,
  Nack,
  RabbitPayload,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Controller, Post } from '@nestjs/common';
import { StripeService } from '@/infra/payments/stripe/stripe.service';
import { CreateCustomerDto, CreateChargeDto } from '@/presentation/dtos';
import { CreateCustomerUseCase } from '@/application/usecases';
import { ProcessOrderUseCase } from '@/application/usecases/process-order.usecase';

@Controller()
export class PaymentsController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly processOrderUseCase: ProcessOrderUseCase,
    private readonly amqpConnection: AmqpConnection,
  ) {}
  @Post()
  testeStripe() {
    return this.stripeService.createPaymentIntent({
      amount: 200,
      orderId: '123',
    });
  }

  @RabbitSubscribe({
    exchange: 'customers-topic-exchange',
    routingKey: 'customers.created',
    queue: 'payments.customer_registration',
  })
  public async customerCreatedEventHandler(
    @RabbitPayload() msg: CreateCustomerDto,
  ) {
    console.log('[PAYMENTS - Customer Created Event Handler]');
    console.log('msg ', msg);
    await this.createCustomerUseCase.execute(msg);
  }

  @RabbitSubscribe({
    exchange: 'orders-topic-exchange',
    routingKey: 'orders.created',
    queue: 'payments.order_registration',
  })
  public async orderCreatedEventHandler(@RabbitPayload() msg: CreateChargeDto) {
    console.log('[PAYMENTS - Order Created Event Handler]');

    try {
      const res = await this.processOrderUseCase.execute(msg);

      return res.client_secret;
    } catch (error) {
      console.log('error ', error.message);
    }
  }
}
