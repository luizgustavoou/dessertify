import { RabbitPayload, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';
import { CreateChargeDto } from '@/presentation/dtos/create-charge.dto';
import { StripeService } from '@/infra/payments/stripe/stripe.service';

@Controller()
export class PaymentsController {
  constructor(private readonly stripeService: StripeService) {}
  // @EventPattern('customer_created')
  // async handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
  //   // Obtendo o canal do contexto
  //   const channel = context.getChannelRef();

  //   const originalMsg = context.getMessage();

  //   // console.log(originalMsg);
  //   console.log('pattern', context.getPattern());
  //   console.log('data ', data);
  //   console.log('originalMsg ', originalMsg);

  //   channel.ack(originalMsg);
  // }
  @Post()
  testeStripe() {
    return this.stripeService.createPaymentIntent(200);
  }

  @RabbitSubscribe({
    exchange: 'customers-topic-exchange',
    routingKey: 'customers.created',
    queue: 'payments.customer_registration',
  })
  public async customerCreatedEventHandler(msg: {}, amqpMsg: ConsumeMessage) {
    console.log('[customerCreatedEventHandler]');
    console.log(`Received message: ${JSON.stringify(msg)}`);
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
