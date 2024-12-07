import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';
import { StripeService } from '@/infra/payments/stripe/stripe.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly stripeService: StripeService) {}
  getHello(): string {
    return "I'm auth serviec!";
  }

  // @RabbitSubscribe({
  //   exchange: 'customers-topic-exchange',
  //   routingKey: 'customers.*',
  //   queue: 'payments',
  // })
  // public async pubSubHandler(msg: {}, amqpMsg: ConsumeMessage) {
  //   console.log(`Received message: ${JSON.stringify(msg)}`);
  //   console.log('amqpMsg ', amqpMsg);
  // }
}
