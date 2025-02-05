import {
  AmqpConnection,
  defaultNackErrorHandler,
  Nack,
  RabbitPayload,
  RabbitRPC,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Controller, Post } from '@nestjs/common';
import { StripeService } from '@/infra/payments/stripe/stripe.service';
import { CreateCustomerDto, CreateChargeDto } from '@/presentation/dtos';
import { CreateCustomerUseCase } from '@/application/usecases';
import { ProcessOrderUseCase } from '@/application/usecases/process-order.usecase';
import amqplib from 'amqplib';
import { cloneDeep } from 'lodash';

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
    queueOptions: {
      deadLetterExchange: 'error-exchange',
      deadLetterRoutingKey: '',
    },
    // errorHandler: (
    //   channel: amqplib.Channel,
    //   msg: amqplib.ConsumeMessage,
    //   error: any,
    // ) => {
    //   console.log('Enviar para a DLX');
    //   return channel.nack(msg, false, false); // Confirma que a mensagem foi processada
    // },
  })
  public async customerCreatedEventHandler(
    // @RabbitPayload() msg: CreateCustomerDto,
    msg: any,
    amqpMsg: amqplib.ConsumeMessage,
  ) {
    console.log('[PAYMENTS - Customer Created Event Handler]');
    // console.log('msg ', msg)
    // console.log('amqpMsg ', amqpMsg);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      throw new Error('Error on customerCreatedEventHandler');
      await this.createCustomerUseCase.execute(msg);
    } catch (error) {
      return new Nack(false);
    }
  }

  @RabbitSubscribe({
    exchange: 'error-exchange',
    routingKey: '',
    queue: 'error-queue',
  })
  public async customerDeadLetterQueue(
    msg: any,
    amqpMsg: amqplib.ConsumeMessage,
  ) {
    console.log('[PAYMENTS - Customer Dead Letter Queue]');

    const {
      'x-first-death-reason': reason,
      'x-first-death-queue': originalQueue,
    } = amqpMsg.properties.headers;

    if (!originalQueue || reason !== 'rejected') {
      console.log('Não é uma mensagem rejeitada ou não tem a fila de origem');
      return;
    }

    const rejectsCount = amqpMsg.properties.headers['x-retry-count'] ?? 0;

    if (rejectsCount === -1 || rejectsCount >= 3) {
      return;
    }

    const properties = cloneDeep(amqpMsg.properties);

    properties.headers['x-retry-count'] = rejectsCount + 1;
    properties.expiration = 3000;

    // this.amqpConnection.channel.sendToQueue(
    //   originalQueue,
    //   amqpMsg.content,
    //   properties,
    // );

    this.amqpConnection.channel.publish(
      'wait-exchange',
      '',
      Buffer.from(JSON.stringify({ originalQueue, ...msg })),
      properties,
    );
  }

  @RabbitSubscribe({
    exchange: 'requeue-exchange',
    routingKey: '',
    queue: 'requeue-queue',
  })
  public async requeueQueueHandler(msg: any, amqpMsg: amqplib.ConsumeMessage) {
    console.log('[requeueQueueHandler]');
    // console.log('amqpMsg ', amqpMsg);
    // console.log('msg', msg);

    const originalQueue = msg.originalQueue;

    if (!originalQueue) {
      return;
    }

    this.amqpConnection.channel.sendToQueue(
      originalQueue,
      amqpMsg.content,
      amqpMsg.properties,
    );
  }

  @RabbitRPC({
    exchange: 'orders-topic-exchange',
    routingKey: 'orders.created',
    queue: 'rpc-payments.order_registration',
    errorHandler: defaultNackErrorHandler,
  })
  public async orderCreatedEventHandler(@RabbitPayload() msg: CreateChargeDto) {
    console.log('[PAYMENTS - Order Created Event Handler]');

    try {
      const res = await this.processOrderUseCase.execute(msg);

      return { client_secret: res.client_secret };
    } catch (error) {
      return new Nack(false);
    }
  }
}
