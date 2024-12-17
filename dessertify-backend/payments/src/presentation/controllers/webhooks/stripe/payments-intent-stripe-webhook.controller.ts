import { OrderPaidEvent } from '@/domain/events/create-charge.event';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('webhooks-stripe/payments-intents')
export class PaymentsIntentsStripeWebhook {
  constructor(private readonly amqpConnection: AmqpConnection) {}
  @Post('succeeded')
  paymentsIntent(@Body() body: any) {
    console.log('[PAYMENTS INTENTS STRIPE WEBHOOK - Succeeded]');

    const orderPaidEvent = new OrderPaidEvent(
      body?.data?.object?.metadata?.order_id,
    );

    this.amqpConnection.publish(
      'payments-topic-exchange',
      'orders.paid',
      orderPaidEvent,
    );
  }
}
